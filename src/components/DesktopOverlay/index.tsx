import type { CSSProperties } from 'react';
import PowerOn from '@/components/PowerOn';
import Desktop from '@/os/Desktop';
import { useOS } from '@/store/os';

const DesktopOverlay = () => {
  const show = useOS((st) => st.expanded && st.layout.mode === 'screen');
  const rect = useOS((st) => st.layout.rects.focus);
  const width = useOS((st) => st.layout.width);
  if (!show) return null;

  /* 3D 화면 자리에서 펼쳐져야 화면 밖(본체·배경)이 한 번에 검게 끊기지 않는다 */
  const from = {
    '--t': `${rect.top}px`,
    '--r': `${window.innerWidth - rect.left - rect.width}px`,
    '--b': `${window.innerHeight - rect.top - rect.height}px`,
    '--l': `${rect.left}px`,
    '--radius': `${(10 * rect.width) / width}px`,
  } as CSSProperties;

  return (
    <PowerOn style={from}>
      <Desktop />
    </PowerOn>
  );
};

export default DesktopOverlay;
