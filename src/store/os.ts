import { MathUtils } from 'three';
import { create } from 'zustand';
import { MENUBAR_H } from '@/three/dims';
import { computeLayout, type Layout } from '@/three/pose';

/**
 * 3D 기기 화면 속 DOM 은 drei Html 이 따로 만든 React root 에 그려져서 context 가 닿지 않는다.
 * 그래서 노트북 · 아이폰 상태와 화면 속 운영체제 상태를 전부 모듈 스토어 하나에 둔다.
 */

export type Phase =
  'closed' | 'opening' | 'booting' | 'desktop' | 'closing' | 'asleep';

/** 창으로 여는 앱. 독의 나머지는 바깥 링크다. */
export type AppId = 'notes' | 'projects';

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WindowState extends Frame {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
}

/** 창 아래로 독이 차지하는 높이 */
export const DOCK_SPACE = 56;
export const MIN_W = 320;
export const MIN_H = 200;

/** 처음 열 때 크기와, 화면 가운데에서 비켜 놓을 거리 */
const FRAMES: Record<AppId, { w: number; h: number; dx: number; dy: number }> =
  {
    notes: { w: 860, h: 520, dx: 0, dy: -12 },
    projects: { w: 780, h: 480, dx: 36, dy: 16 },
  };

const defaultFrame = (id: AppId, W: number, H: number): Frame => {
  const area = H - MENUBAR_H;
  const f = FRAMES[id];
  const w = Math.min(f.w, W - 40);
  const h = Math.min(f.h, area - DOCK_SPACE - 24);
  return {
    w,
    h,
    x: Math.round(MathUtils.clamp((W - w) / 2 + f.dx, 8, W - w - 8)),
    y: Math.round(
      MathUtils.clamp((area - DOCK_SPACE - h) / 2 + f.dy, 8, area - h - 8),
    ),
  };
};

/** 제목 막대를 잡을 수 있을 만큼은 늘 화면 안에 남긴다. */
export const clampFrame = (f: Frame, W: number, H: number): Frame => {
  const area = H - MENUBAR_H;
  const w = MathUtils.clamp(f.w, MIN_W, W);
  const h = MathUtils.clamp(f.h, MIN_H, area);
  return {
    w,
    h,
    x: MathUtils.clamp(f.x, 80 - w, W - 80),
    y: MathUtils.clamp(f.y, 0, area - 32),
  };
};

/** 처음에는 메모만 열어 둔다. */
const makeWindows = ({ viewport }: Layout): Record<AppId, WindowState> => {
  const frame = (id: AppId) =>
    defaultFrame(id, viewport.width, viewport.height);
  return {
    notes: {
      ...frame('notes'),
      open: true,
      minimized: false,
      maximized: false,
      z: 1,
    },
    projects: {
      ...frame('projects'),
      open: false,
      minimized: false,
      maximized: false,
      z: 0,
    },
  };
};

/** 맨 위에 보이는 창. 닫거나 내리면 그다음 창으로 초점이 넘어간다. */
const topmost = (
  windows: Record<AppId, WindowState>,
  except?: AppId,
): AppId | null => {
  const visible = (Object.keys(windows) as AppId[]).filter(
    (id) => id !== except && windows[id].open && !windows[id].minimized,
  );
  if (visible.length === 0) return null;
  return visible.reduce((a, b) => (windows[a].z > windows[b].z ? a : b));
};

const reducedMotion =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const initialLayout = computeLayout(window.innerWidth, window.innerHeight);

type Toggle = 'wifi' | 'bluetooth' | 'airdrop';

interface OSState {
  phase: Phase;
  layout: Layout;
  /** 0 이면 기기 전체, 1 이면 화면이 뷰포트를 채운다. 켜지면 저절로 1 로 간다. */
  zoom: number;
  /** 기기 화면에 다 다가간 뒤, 3D 화면 대신 뷰포트를 꽉 채운 진짜 화면으로 바꿔 끼운 상태 */
  expanded: boolean;

  windows: Record<AppId, WindowState>;
  focused: AppId | null;
  zTop: number;
  spotlight: boolean;
  /** 아이폰에서 전체 화면으로 열려 있는 앱 */
  phoneApp: AppId | null;

  dark: boolean;
  /** 0~100. 화면 위에 검은 막을 덮어 어둡게 한다. */
  brightness: number;
  volume: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;

  /** 메모 앱에서 고른 글. Spotlight 에서도 바로 연다. */
  noteId: string | null;
  /** 프로젝트 앱에서 열어 둔 폴더(글). 없으면 폴더 목록이다. */
  projectId: string | null;

  setPhase: (phase: Phase) => void;
  setViewport: (vw: number, vh: number) => void;
  setExpanded: (expanded: boolean) => void;

  open: (id: AppId) => void;
  close: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  focus: (id: AppId) => void;
  setFrame: (id: AppId, frame: Frame) => void;
  setSpotlight: (open: boolean) => void;
  openPhoneApp: (app: AppId) => void;
  closePhoneApp: () => void;

  toggleDark: () => void;
  toggle: (key: Toggle) => void;
  setBrightness: (v: number) => void;
  setVolume: (v: number) => void;

  setNoteId: (id: string | null) => void;
  showNote: (id: string) => void;
  setProjectId: (id: string | null) => void;
  showProject: (id: string) => void;

  sleep: () => void;
  wake: () => void;
}

export const useOS = create<OSState>((set, get) => ({
  phase: reducedMotion ? 'desktop' : 'closed',
  layout: initialLayout,
  zoom: reducedMotion ? 1 : 0,
  expanded: reducedMotion,

  windows: makeWindows(initialLayout),
  focused: 'notes',
  zTop: 1,
  spotlight: false,
  phoneApp: null,

  // 맥처럼 시스템 설정의 다크 모드를 따라 시작한다.
  dark:
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-color-scheme: dark)').matches,
  brightness: 100,
  volume: 70,
  wifi: true,
  bluetooth: true,
  airdrop: false,

  noteId: null,
  projectId: null,

  setPhase: (phase) =>
    set((s) => ({
      phase,
      // 부팅이 시작되면 막대가 차는 동안 화면 쪽으로 다가가, 다 차자마자 넘어갈 수 있게 한다.
      // 다시 열 때는 멀리서부터 다시 보여 준다. 다 다가가면 CameraRig 가 진짜 화면으로 바꿔 끼운다(expanded).
      zoom:
        phase === 'booting' || phase === 'desktop'
          ? 1
          : phase === 'opening'
            ? 0
            : s.zoom,
    })),

  setViewport: (vw, vh) =>
    set((s) => {
      const layout = computeLayout(vw, vh);
      const { width, height } = layout.viewport;
      const windows = { ...s.windows };
      for (const id of Object.keys(windows) as AppId[]) {
        windows[id] = {
          ...windows[id],
          ...clampFrame(windows[id], width, height),
        };
      }
      // 맥북 ↔ 아이폰이 바뀌면 다가가는 장면을 다시 보이지 않고 바로 진짜 화면을 띄운다.
      const modeChanged = layout.mode !== s.layout.mode;
      return {
        layout,
        windows,
        expanded: modeChanged ? s.phase === 'desktop' : s.expanded,
      };
    }),

  setExpanded: (expanded) => set({ expanded }),

  open: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], open: true, minimized: false, z: s.zTop + 1 },
      },
      zTop: s.zTop + 1,
      focused: id,
      phoneApp: id,
      spotlight: false,
    })),

  close: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], open: false, maximized: false },
      },
      focused: topmost(s.windows, id),
      phoneApp: s.phoneApp === id ? null : s.phoneApp,
    })),

  minimize: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
      focused: topmost(s.windows, id),
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], maximized: !s.windows[id].maximized },
      },
    })),

  focus: (id) => {
    if (get().focused === id) return;
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], z: s.zTop + 1 } },
      zTop: s.zTop + 1,
      focused: id,
    }));
  },

  setFrame: (id, frame) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          ...clampFrame(
            frame,
            s.layout.viewport.width,
            s.layout.viewport.height,
          ),
        },
      },
    })),

  setSpotlight: (spotlight) => set({ spotlight }),
  openPhoneApp: (phoneApp) => set({ phoneApp }),
  closePhoneApp: () => set({ phoneApp: null }),

  toggleDark: () => set((s) => ({ dark: !s.dark })),
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
  setBrightness: (brightness) => set({ brightness }),
  setVolume: (volume) => set({ volume }),

  setNoteId: (noteId) => set({ noteId }),
  showNote: (noteId) => {
    set({ noteId });
    get().open('notes');
  },
  setProjectId: (projectId) => set({ projectId }),
  showProject: (projectId) => {
    set({ projectId });
    get().open('projects');
  },

  sleep: () => set({ expanded: false, spotlight: false, phase: 'closing' }),

  wake: () => {
    const { phase } = get();
    if (phase === 'asleep' || phase === 'closed') set({ phase: 'opening' });
  },
}));

// 개발 중 콘솔에서 상태를 들여다보고 단계를 건너뛸 수 있게 한다.
if (import.meta.env.DEV) {
  (window as unknown as { __os: typeof useOS }).__os = useOS;
}
