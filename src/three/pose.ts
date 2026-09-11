import { MathUtils, Vector3 } from 'three';
import {
  BASE,
  DISPLAY,
  DISPLAY_ASPECT,
  DISPLAY_Z,
  FOV,
  HINGE,
  LID,
  OPEN_ANGLE,
  PHONE,
  PHONE_DISPLAY,
  PHONE_Y,
} from './dims';

export type View = 'overview' | 'focus';

export interface Pose {
  position: Vector3;
  target: Vector3;
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Fit {
  pose: Pose;
  /** 카메라에서 화면 평면까지 거리 */
  dist: number;
  /** 화면 중심에서 카메라 축을 위로 옮긴 양 */
  shift: number;
}

export interface Layout {
  /** screen: 맥북을 띄운다. compact: 폰이라 아이폰을 띄운다. 둘 다 화면에 다가간 뒤 뷰포트를 채운 진짜 화면으로 바꿔 끼운다. */
  mode: 'screen' | 'compact';
  /** 3D 기기 화면에 붙이는 DOM 의 가상 해상도(CSS px). 다가간 시점에서 1:1 로 그려지도록 잡아야 글자가 선명하다. */
  width: number;
  height: number;
  /** 브라우저 창 크기. 바꿔 끼운 뒤의 바탕화면과 창은 이 크기 안에서 움직인다. */
  viewport: { width: number; height: number };
  rects: Record<View, Rect>;
}

/** 카메라가 비추는 기기 하나. 화면이 어디를 보고 있고, 몸체와 화면이 어디까지인지. */
export interface Subject {
  center: Vector3;
  normal: Vector3;
  up: Vector3;
  body: Vector3[];
  display: Vector3[];
  displayW: number;
  displayH: number;
  /** 첫 장면이 바라보는 곳과, 전체 보기보다 몇 배 멀리서 시작할지 */
  rest: Vector3;
  pullBack: number;
  /** 뷰포트에서 차지할 가로 · 세로 비율. overview 는 기기 전체, focus 는 화면만 */
  margins: Record<View, [number, number]>;
}

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);
const TAN = Math.tan(MathUtils.degToRad(FOV) / 2);

const SIGNS = [-1, 1].flatMap((a) => [-1, 1].map((b) => [a, b] as const));

const corners = (c: Vector3, up: Vector3, w: number, h: number) =>
  SIGNS.map(([sx, sy]) =>
    c
      .clone()
      .addScaledVector(X_AXIS, (sx * w) / 2)
      .addScaledVector(up, (sy * h) / 2),
  );

/* ---------- MacBook ---------- */

/** 뚜껑 좌표 → 월드 좌표 (다 열린 상태 기준) */
const lidToWorld = (v: Vector3) =>
  v.clone().applyAxisAngle(X_AXIS, -OPEN_ANGLE).add(HINGE);

const macCenter = lidToWorld(new Vector3(0, -LID.t / 2, DISPLAY_Z));
const macUp = new Vector3(0, 0, 1).applyAxisAngle(X_AXIS, -OPEN_ANGLE);

export const MACBOOK: Subject = {
  center: macCenter,
  normal: new Vector3(0, -1, 0).applyAxisAngle(X_AXIS, -OPEN_ANGLE),
  up: macUp,
  body: [
    ...SIGNS.flatMap(([sx, sz]) =>
      [0, BASE.h].map(
        (y) => new Vector3((sx * BASE.w) / 2, y, (sz * BASE.d) / 2),
      ),
    ),
    ...SIGNS.map(([sx, sy]) =>
      lidToWorld(
        new Vector3((sx * BASE.w) / 2, (sy * LID.t) / 2, BASE.d - LID.t / 2),
      ),
    ),
  ],
  display: corners(macCenter, macUp, DISPLAY.w, DISPLAY.h),
  displayW: DISPLAY.w,
  displayH: DISPLAY.h,
  // 닫힌 노트북 가운데를 본다. 방향은 화면을 볼 때와 같아 가로선 · 세로선이 반듯하다.
  rest: new Vector3(0, (BASE.h + LID.t) / 2, 0),
  pullBack: 1.08,
  margins: { overview: [0.9, 0.82], focus: [0.985, 0.975] },
};

/* ---------- iPhone ---------- */

const phoneCenter = new Vector3(0, PHONE_Y, PHONE.d / 2);

export const IPHONE: Subject = {
  center: phoneCenter,
  normal: Z_AXIS,
  up: Y_AXIS,
  body: [-1, 1].flatMap((sz) =>
    corners(
      new Vector3(0, PHONE_Y, (sz * PHONE.d) / 2),
      Y_AXIS,
      PHONE.w,
      PHONE.h,
    ),
  ),
  display: corners(phoneCenter, Y_AXIS, PHONE_DISPLAY.w, PHONE_DISPLAY.h),
  displayW: PHONE_DISPLAY.w,
  displayH: PHONE_DISPLAY.h,
  rest: phoneCenter.clone(),
  pullBack: 1.3,
  // 세운 폰은 길쭉해서 위아래 여백을 조금 줄인다.
  margins: { overview: [0.92, 0.9], focus: [0.985, 0.975] },
};

export const subjectFor = (mode: Layout['mode']) =>
  mode === 'compact' ? IPHONE : MACBOOK;

/**
 * 화면을 정면으로 보는 방향은 고정하고, 거리와 위아래 이동만으로 대상을 뷰포트에 넣는다.
 * 카메라가 화면과 평행해야 그 위의 DOM 이 찌그러지지 않고 선명하게 그려진다.
 */
export function fit(subject: Subject, aspect: number, view: View): Fit {
  const { center, normal, up } = subject;
  const points = view === 'overview' ? subject.body : subject.display;
  const [mx, my] = subject.margins[view];
  const rel = points.map((p) => {
    const r = p.clone().sub(center);
    return { x: r.x, y: r.dot(up), n: r.dot(normal) };
  });

  const distFor = (shift: number) =>
    Math.max(
      ...rel.map(
        (p) =>
          p.n +
          Math.max(
            Math.abs(p.x) / (mx * TAN * aspect),
            Math.abs(p.y - shift) / (my * TAN),
          ),
      ),
    );

  // 맥북은 바닥판이 화면보다 카메라에 가까워 아래로 더 크게 보인다. 위아래 여백이 같아지도록 축을 옮긴다.
  let shift = 0;
  for (let i = 0; i < 6; i++) {
    const dist = distFor(shift);
    const ys = rel.map((p) => (p.y - shift) / ((dist - p.n) * TAN));
    shift += ((Math.max(...ys) + Math.min(...ys)) / 2) * dist * TAN;
  }
  const dist = distFor(shift);
  const target = center.clone().addScaledVector(up, shift);
  return {
    pose: { position: target.clone().addScaledVector(normal, dist), target },
    dist,
    shift,
  };
}

/** 첫 장면. 방향은 화면을 볼 때와 똑같이 두고 조금 물러서서 본다. */
export const startPose = (subject: Subject, overviewDist: number): Pose => ({
  position: subject.rest
    .clone()
    .addScaledVector(subject.normal, overviewDist * subject.pullBack),
  target: subject.rest.clone(),
});

/** 그 시점에서 화면 표시 영역이 뷰포트의 어디에 그려지는지 (px) */
const displayRect = (
  subject: Subject,
  f: Fit,
  vw: number,
  vh: number,
): Rect => {
  const pxPerUnit = vh / (2 * f.dist * TAN);
  const width = subject.displayW * pxPerUnit;
  const height = subject.displayH * pxPerUnit;
  return {
    left: (vw - width) / 2,
    top: vh / 2 + f.shift * pxPerUnit - height / 2,
    width,
    height,
  };
};

const rectsFor = (
  subject: Subject,
  aspect: number,
  vw: number,
  vh: number,
) => ({
  overview: displayRect(subject, fit(subject, aspect, 'overview'), vw, vh),
  focus: displayRect(subject, fit(subject, aspect, 'focus'), vw, vh),
});

export function computeLayout(vw: number, vh: number): Layout {
  if (!vw || !vh) return computeLayout(1280, 800);
  const aspect = vw / vh;
  const mac = rectsFor(MACBOOK, aspect, vw, vh);

  // 맥북 화면을 꽉 채워도 640px 이 안 되면 창을 띄워 쓰기엔 글자가 너무 작다. 그런 폰에서는 아이폰을 띄운다.
  // 아이폰 화면은 다가간 뒤 뷰포트로 꺼내므로, 3D 속 화면도 뷰포트 폭에 맞춰 둔다.
  if (vw < 640 || vh < 480 || mac.focus.width < 640) {
    const width = Math.round(MathUtils.clamp(vw, 320, 480));
    return {
      mode: 'compact',
      width,
      height: Math.round((width * PHONE_DISPLAY.h) / PHONE_DISPLAY.w),
      viewport: { width: vw, height: vh },
      rects: rectsFor(IPHONE, aspect, vw, vh),
    };
  }

  const width = Math.round(MathUtils.clamp(mac.focus.width, 880, 1440));
  return {
    mode: 'screen',
    width,
    height: Math.round(width / DISPLAY_ASPECT),
    viewport: { width: vw, height: vh },
    rects: mac,
  };
}
