import { useEffect, type RefObject } from 'react';

/** ref 바깥을 누르면 닫는다. 여는 버튼(ignore)을 누른 건 바깥으로 치지 않는다. */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  ignore: RefObject<HTMLElement | null>[] = [],
) => {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (ignore.some((r) => r.current?.contains(target))) return;
      onOutside();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  });
};
