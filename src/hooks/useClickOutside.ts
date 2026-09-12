import { useEffect, type RefObject } from 'react';

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
