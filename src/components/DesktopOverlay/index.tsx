import PowerOn from '@/components/PowerOn';
import Desktop from '@/os/Desktop';
import { useOS } from '@/store/os';

/**
 * 맥북 화면에 다 다가가면 화면이 잠깐 꺼졌다가, 노트북 없이 뷰포트를 꽉 채운 바탕화면으로 켜진다.
 * 3D 화면에는 부팅 화면만 붙이고, 실제로 쓰는 화면은 전부 여기서 평평하게 그린다.
 */
const DesktopOverlay = () => {
  const show = useOS((st) => st.expanded && st.layout.mode === 'screen');
  if (!show) return null;
  return (
    <PowerOn>
      <Desktop />
    </PowerOn>
  );
};

export default DesktopOverlay;
