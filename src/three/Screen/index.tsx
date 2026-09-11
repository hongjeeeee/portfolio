import { Html } from '@react-three/drei';
import BootScreen from '@/os/BootScreen';
import { useOS } from '@/store/os';
import { DISPLAY, DISPLAY_Z, LID } from '../dims';
import s from './style.module.css';

/**
 * 뚜껑 안쪽 화면 자리에 부팅 화면을 CSS 3D 로 붙인다.
 * 다 다가가면 DesktopOverlay 가 뷰포트를 꽉 채운 바탕화면으로 바꿔 끼우므로, 여기에는 부팅 화면만 그린다.
 * drei Html 은 CSS 1px 을 distanceFactor / 400 월드 단위로 옮기므로,
 * 가상 해상도 폭이 정확히 화면 폭(DISPLAY.w)에 맞도록 거꾸로 계산한다.
 */
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
