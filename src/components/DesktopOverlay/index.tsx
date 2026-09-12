import PowerOn from '@/components/PowerOn';
import Desktop from '@/os/Desktop';
import { useOS } from '@/store/os';

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
