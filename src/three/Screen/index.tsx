import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useWheelScroll } from '@/hooks/useWheelScroll';
import ScreenContent from '@/os/ScreenContent';
import { useOS } from '@/store/os';
import { DISPLAY, DISPLAY_Z, LID } from '../dims';
import s from './style.module.css';

/**
 * 뚜껑 안쪽 화면 자리에 DOM 을 CSS 3D 로 붙인다.
 * drei Html 은 CSS 1px 을 distanceFactor / 400 월드 단위로 옮기므로,
 * 가상 해상도 폭이 정확히 화면 폭(DISPLAY.w)에 맞도록 거꾸로 계산한다.
 */
const Screen = () => {
  const on = useOS((st) => st.phase === 'booting' || st.phase === 'desktop');
  const width = useOS((st) => st.layout.width);
  const height = useOS((st) => st.layout.height);
  // CSS 3D 안이라 휠 스크롤이 먹지 않는다. 화면 DOM 이 붙으면 휠을 대신 받는다.
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useWheelScroll(el);

  if (!on) return null;

  return (
    <Html
      ref={setEl}
      transform
      position={[0, -LID.t / 2 - 0.002, DISPLAY_Z]}
      rotation-x={Math.PI / 2}
      distanceFactor={(400 * DISPLAY.w) / width}
      zIndexRange={[10, 0]}
      wrapperClass={s.wrapper}
      className={s.screen}
      style={{ width, height }}
    >
      <ScreenContent />
      <span className={s.sheen} aria-hidden />
    </Html>
  );
};

export default Screen;
