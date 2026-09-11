import { Html } from '@react-three/drei';
import Home from '@/ios/Home';
import BootScreen from '@/os/BootScreen';
import { useOS } from '@/store/os';
import { PHONE, PHONE_DISPLAY } from '../dims';
import s from './style.module.css';

/**
 * 아이폰 화면 자리에 DOM 을 붙인다. 부팅과 다가가는 동안만 보이고,
 * 다 다가가면 CompactOverlay 가 진짜 크기의 화면으로 바꿔 끼운다.
 */
const PhoneScreen = () => {
  const phase = useOS((st) => st.phase);
  const expanded = useOS((st) => st.expanded);
  const width = useOS((st) => st.layout.width);
  const height = useOS((st) => st.layout.height);

  if ((phase !== 'booting' && phase !== 'desktop') || expanded) return null;

  return (
    <Html
      transform
      position={[0, 0, PHONE.d / 2 + 0.0015]}
      distanceFactor={(400 * PHONE_DISPLAY.w) / width}
      zIndexRange={[10, 0]}
      wrapperClass={s.wrapper}
      className={s.screen}
      style={{
        width,
        height,
        borderRadius: (PHONE_DISPLAY.r / PHONE_DISPLAY.w) * width,
      }}
    >
      {phase === 'booting' ? <BootScreen phone /> : <Home inPhone />}
      <span className={s.sheen} aria-hidden />
    </Html>
  );
};

export default PhoneScreen;
