import { useEffect } from 'react';
import { useOS } from '@/store/os';
import s from './style.module.css';

/** 아래로 이만큼(px) 스크롤하면 연다. 트랙패드를 스치기만 해서는 열리지 않게 조금 모은다. */
const PULL = 40;
/** 스크롤과 같은 일을 하는 키. 휠이 없어도 키보드로 열 수 있다. */
const KEYS = new Set(['ArrowDown', 'PageDown', 'End', ' ']);

/**
 * 잠든 노트북을 깨우는 안내. 노트북 바깥에 뜨는 건 이것뿐이다.
 * 누르는 버튼 대신, 아래로 스크롤하면(휠 · 트랙패드 · 손가락으로 쓸어 올리기 · 키보드) 뚜껑이 열린다.
 */
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

    // 줄 · 쪽 단위로 오는 휠(파이어폭스)은 한 칸만 굴려도 연다.
    const onWheel = (e: WheelEvent) =>
      pull(
        e.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? e.deltaY : e.deltaY * PULL,
      );
    // 손가락을 위로 쓸어 올리면 페이지를 아래로 내리는 셈이다.
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
