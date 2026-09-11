import { useEffect } from 'react';

/** 줄 단위로 오는 휠(파이어폭스) 한 줄의 높이. 크롬이 한 칸(3줄)에 100px 움직이는 것과 맞춘다. */
const LINE = 33;

const scrolls = (overflow: string) =>
  overflow === 'auto' || overflow === 'scroll';

/** from 에서 root 까지 올라가며, 그 방향으로 아직 더 움직일 수 있는 첫 스크롤 영역 */
const scrollerFor = (
  from: Element | null,
  root: Element,
  axis: 'x' | 'y',
  delta: number,
) => {
  for (let el = from; el; el = el === root ? null : el.parentElement) {
    const style = getComputedStyle(el);
    const vertical = axis === 'y';
    const overflow = vertical ? style.overflowY : style.overflowX;
    const pos = vertical ? el.scrollTop : el.scrollLeft;
    const max = vertical
      ? el.scrollHeight - el.clientHeight
      : el.scrollWidth - el.clientWidth;
    if (scrolls(overflow) && (delta < 0 ? pos > 0 : pos < max - 1)) return el;
  }
  return null;
};

/**
 * CSS 3D(preserve-3d) 안의 스크롤 영역은 크롬에서 휠을 굴려도 움직이지 않는다.
 * 스크롤바는 보이고 scrollTop 을 바꾸면 움직이니, 휠을 대신 받아 가장 가까운 스크롤 영역을 직접 옮긴다.
 */
export const useWheelScroll = (root: HTMLElement | null) => {
  useEffect(() => {
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      // 트랙패드 핀치(ctrl + 휠)는 브라우저 확대로 둔다.
      if (e.ctrlKey) return;
      const unit =
        e.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? LINE
          : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? root.clientHeight
            : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      const target = e.target instanceof Element ? e.target : null;
      const y = dy ? scrollerFor(target, root, 'y', dy) : null;
      const x = dx ? scrollerFor(target, root, 'x', dx) : null;
      if (!x && !y) return;
      // 기본 스크롤을 막아야, 원래 잘 되는 브라우저에서 두 번 움직이지 않는다.
      e.preventDefault();
      if (y) y.scrollTop += dy;
      if (x) x.scrollLeft += dx;
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [root]);
};
