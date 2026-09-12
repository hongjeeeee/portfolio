import { MathUtils } from 'three';
import { create } from 'zustand';
import { MENUBAR_H } from '@/three/dims';
import { computeLayout, type Layout } from '@/three/pose';

export type Phase =
  'closed' | 'opening' | 'booting' | 'desktop' | 'closing' | 'asleep';

// 추가: [앱 이름]
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

export const DOCK_SPACE = 56;
export const MIN_W = 320;
export const MIN_H = 200;

// 수정: [창 크기 · 자리]
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

  zoom: number;

  expanded: boolean;

  windows: Record<AppId, WindowState>;
  focused: AppId | null;
  zTop: number;
  spotlight: boolean;

  phoneApp: AppId | null;

  dark: boolean;

  brightness: number;
  volume: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;

  noteId: string | null;

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

if (import.meta.env.DEV) {
  (window as unknown as { __os: typeof useOS }).__os = useOS;
}
