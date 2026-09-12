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

  dist: number;

  shift: number;
}

export interface Layout {
  mode: 'screen' | 'compact';

  width: number;
  height: number;

  viewport: { width: number; height: number };
  rects: Record<View, Rect>;
}

export interface Subject {
  center: Vector3;
  normal: Vector3;
  up: Vector3;
  body: Vector3[];
  display: Vector3[];
  displayW: number;
  displayH: number;

  rest: Vector3;
  pullBack: number;

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

  rest: new Vector3(0, (BASE.h + LID.t) / 2, 0),
  pullBack: 1.08,
  margins: { overview: [0.9, 0.82], focus: [0.985, 0.975] },
};

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

  margins: { overview: [0.92, 0.9], focus: [0.985, 0.975] },
};

export const subjectFor = (mode: Layout['mode']) =>
  mode === 'compact' ? IPHONE : MACBOOK;

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

export const startPose = (subject: Subject, overviewDist: number): Pose => ({
  position: subject.rest
    .clone()
    .addScaledVector(subject.normal, overviewDist * subject.pullBack),
  target: subject.rest.clone(),
});

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
