import type { CSSProperties } from 'react';
import Home from '@/ios/Home';
import { useOS } from '@/store/os';
import { PHONE_DISPLAY } from '@/three/dims';
import s from './style.module.css';

const CompactOverlay = () => {
  const expanded = useOS((st) => st.expanded && st.layout.mode === 'compact');
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
