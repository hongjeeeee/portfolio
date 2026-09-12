import { Html } from '@react-three/drei';
import BootScreen from '@/os/BootScreen';
import { useOS } from '@/store/os';
import { DISPLAY, DISPLAY_Z, LID } from '../dims';
import s from './style.module.css';

const Screen = () => {
  const on = useOS(
    (st) => (st.phase === 'booting' || st.phase === 'desktop') && !st.expanded,
  );
  const width = useOS((st) => st.layout.width);
  const height = useOS((st) => st.layout.height);

  if (!on) return null;

  return (
    <Html
      transform
      position={[0, -LID.t / 2 - 0.002, DISPLAY_Z]}
      rotation-x={Math.PI / 2}
      distanceFactor={(400 * DISPLAY.w) / width}
      zIndexRange={[10, 0]}
      wrapperClass={s.wrapper}
      className={s.screen}
      style={{ width, height }}
    >
      <BootScreen />
      <span className={s.sheen} aria-hidden />
    </Html>
  );
};

export default Screen;
