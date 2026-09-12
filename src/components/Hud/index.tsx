import { useEffect } from 'react';
import { useOS } from '@/store/os';
import s from './style.module.css';

const PULL = 40;

const KEYS = new Set(['ArrowDown', 'PageDown', 'End', ' ']);

const Hud = () => {
  const asleep = useOS((st) => st.phase === 'asleep');
  const wake = useOS((st) => st.wake);

  useEffect(() => {
    if (!asleep) return;
    let pulled = 0;
    let touchY = 0;
    const pull = (dy: number) => {
      pulled = Math.max(0, pulled + dy);
      if (pulled >= PULL) wake();
    };

    const onWheel = (e: WheelEvent) =>
      pull(
        e.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? e.deltaY : e.deltaY * PULL,
      );

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      pull(touchY - y);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (KEYS.has(e.key)) wake();
    };

    const ctrl = new AbortController();
    const opts = { passive: true, signal: ctrl.signal };
    window.addEventListener('wheel', onWheel, opts);
    window.addEventListener('touchstart', onTouchStart, opts);
    window.addEventListener('touchmove', onTouchMove, opts);
    window.addEventListener('keydown', onKey, { signal: ctrl.signal });
    return () => ctrl.abort();
  }, [asleep, wake]);

  if (!asleep) return null;

  return (
    <div className={s.hint} role="status">
      <svg
        className={s.mouse}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="5" y="2" width="14" height="20" rx="7" />
        <g className={s.arrow}>
          <path d="M12 6v8" />
          <path d="m15 11-3 3-3-3" />
        </g>
      </svg>
      <span className={s.label}>스크롤해서 열기</span>
    </div>
  );
};

export default Hud;
