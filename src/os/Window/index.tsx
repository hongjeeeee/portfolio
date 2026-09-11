import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { MIN_H, MIN_W, useOS, type AppId, type Frame } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph from '../glyphs';
import s from './style.module.css';

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

interface Props {
  id: AppId;
  title: string;
  compact: boolean;
  /** 화면 속 DOM 이 CSS 3D 로 커지거나 줄어든 배율. 포인터 이동량을 이만큼 나눠야 손을 따라온다. */
  scale: number;
  children: ReactNode;
}

/** 포인터를 잡고 끄는 동안 움직인 거리(가상 화면 px)를 넘겨준다. */
const track = (
  e: ReactPointerEvent<HTMLElement>,
  scale: number,
  onMove: (dx: number, dy: number) => void,
) => {
  const el = e.currentTarget;
  const sx = e.clientX;
  const sy = e.clientY;
  el.setPointerCapture(e.pointerId);
  const move = (ev: PointerEvent) =>
    onMove((ev.clientX - sx) / scale, (ev.clientY - sy) / scale);
  const up = () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
};

const resize = (f: Frame, edge: Edge, dx: number, dy: number): Frame => {
  let { x, y, w, h } = f;
  if (edge.includes('e')) w = Math.max(MIN_W, f.w + dx);
  if (edge.includes('s')) h = Math.max(MIN_H, f.h + dy);
  if (edge.includes('w')) {
    w = Math.max(MIN_W, f.w - dx);
    x = f.x + f.w - w;
  }
  if (edge.includes('n')) {
    h = Math.max(MIN_H, f.h - dy);
    y = f.y + f.h - h;
  }
  return { x, y, w, h };
};

const Window = ({ id, title, compact, scale, children }: Props) => {
  const win = useOS((st) => st.windows[id]);
  const focused = useOS((st) => st.focused === id);
  const { close, minimize, toggleMaximize, focus, setFrame } = useOS.getState();
  const ref = useRef<HTMLElement>(null);
  /** 최소화할 때 빨려 들어갈 독 아이콘까지의 거리 */
  const [genie, setGenie] = useState({ x: 0, y: 0 });

  if (!win.open) return null;
  const full = compact || win.maximized;

  const drag = (e: ReactPointerEvent<HTMLElement>) => {
    focus(id);
    if (full || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    track(e, scale, (dx, dy) =>
      setFrame(id, { ...start, x: start.x + dx, y: start.y + dy }),
    );
  };

  const startResize = (edge: Edge) => (e: ReactPointerEvent<HTMLElement>) => {
    e.stopPropagation();
    focus(id);
    const start = { x: win.x, y: win.y, w: win.w, h: win.h };
    track(e, scale, (dx, dy) => setFrame(id, resize(start, edge, dx, dy)));
  };

  const onMinimize = () => {
    const el = ref.current;
    const icon = el
      ?.closest('[data-desktop]')
      ?.querySelector(`[data-dock="${id}"]`);
    if (el && icon) {
      const a = el.getBoundingClientRect();
      const b = icon.getBoundingClientRect();
      setGenie({
        x: (b.left + b.width / 2 - (a.left + a.width / 2)) / scale,
        y: (b.top + b.height / 2 - (a.top + a.height / 2)) / scale,
      });
    }
    minimize(id);
  };

  return (
    <section
      ref={ref}
      className={cx(
        s.window,
        focused && s.focused,
        full && s.full,
        compact && s.compact,
        win.minimized && s.minimized,
      )}
      style={
        full
          ? { zIndex: win.z }
          : {
              left: win.x,
              top: win.y,
              width: win.w,
              height: win.h,
              zIndex: win.z,
            }
      }
      onPointerDown={() => focus(id)}
      aria-label={title}
      aria-hidden={win.minimized}
      data-window
    >
      <div
        className={s.frame}
        style={
          win.minimized
            ? { transform: `translate(${genie.x}px, ${genie.y}px) scale(0.1)` }
            : undefined
        }
      >
        <header
          className={s.bar}
          onPointerDown={drag}
          onDoubleClick={() => !compact && toggleMaximize(id)}
        >
          <div className={s.lights}>
            <button
              type="button"
              className={s.close}
              onClick={() => close(id)}
              aria-label="닫기"
            >
              <Glyph name="close" strokeWidth={3.2} />
            </button>
            <button
              type="button"
              className={s.min}
              onClick={onMinimize}
              aria-label="최소화"
              disabled={full}
            >
              <Glyph name="minus" strokeWidth={3.2} />
            </button>
            <button
              type="button"
              className={s.max}
              onClick={() => toggleMaximize(id)}
              aria-label={win.maximized ? '원래 크기로' : '전체 화면'}
              disabled={compact}
            >
              <Glyph
                name={win.maximized ? 'fullscreenExit' : 'fullscreen'}
                strokeWidth={3}
              />
            </button>
          </div>
          <h2 className={s.title}>{title}</h2>
        </header>
        <div className={s.body}>{children}</div>
        {!full &&
          EDGES.map((edge) => (
            <span
              key={edge}
              className={cx(s.edge, s[edge])}
              onPointerDown={startResize(edge)}
            />
          ))}
      </div>
    </section>
  );
};

export default Window;
