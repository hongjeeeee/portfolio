import { useOS } from '@/store/os';
import BootScreen from '../BootScreen';
import Desktop from '../Desktop';

/** 맥북 화면 안에 들어가는 것. 폰에서는 맥북 대신 아이폰이 뜨므로 여기 오지 않는다. */
const ScreenContent = () => {
  const phase = useOS((st) => st.phase);
  return phase === 'booting' ? <BootScreen /> : <Desktop />;
};

export default ScreenContent;
