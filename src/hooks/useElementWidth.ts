import { useLayoutEffect, useRef, useState } from 'react';

/**
 * 요소의 레이아웃 폭. 화면 속 DOM 은 CSS 3D 로 줄어들어 있어서
 * getBoundingClientRect 가 아니라 변환 전 폭(contentRect)을 봐야 한다.
 */
export const useElementWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
};
