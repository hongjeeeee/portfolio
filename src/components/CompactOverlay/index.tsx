import type { CSSProperties } from 'react';
import Home from '@/ios/Home';
import { useOS } from '@/store/os';
import { PHONE_DISPLAY } from '@/three/dims';
import s from './style.module.css';

/**
 * 3D 아이폰 화면에 다 다가간 뒤, 그 자리에서 진짜 크기의 화면으로 바꿔 끼운다.
 * clip-path 의 시작점이 3D 화면이 그려진 자리라 이음매가 보이지 않는다.
 */
const CompactOverlay = () => {
  const expanded = useOS((st) => st.expanded);
  const rect = useOS((st) => st.layout.rects.focus);

  if (!expanded) return null;

  const from = {
    '--t': `${rect.top}px`,
    '--r': `${window.innerWidth - rect.left - rect.width}px`,
    '--b': `${window.innerHeight - rect.top - rect.height}px`,
    '--l': `${rect.left}px`,
    '--radius': `${(PHONE_DISPLAY.r / PHONE_DISPLAY.w) * rect.width}px`,
  } as CSSProperties;

  return (
    <div className={s.overlay} style={from}>
      <Home />
    </div>
  );
};

export default CompactOverlay;
