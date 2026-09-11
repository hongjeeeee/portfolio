import { useOS } from '@/store/os';
import { LogoGlyph } from '../icons';
import s from './style.module.css';

/**
 * 맥은 막대가 다 차면, 아이폰은 표식이 떠올랐다 잠시 머물면 바탕화면으로 넘어간다.
 * 둘 다 애니메이션이 끝나는 순간(animationend)을 신호로 쓴다.
 */
const BootScreen = ({ phone = false }: { phone?: boolean }) => {
  const setPhase = useOS((st) => st.setPhase);
  const done = () => setPhase('desktop');

  if (phone) {
    return (
      <div className={s.boot}>
        <span className={s.phoneLogo} onAnimationEnd={done}>
          <LogoGlyph className={s.logo} />
        </span>
      </div>
    );
  }

  return (
    <div className={s.boot}>
      <LogoGlyph className={s.logo} />
      <div className={s.track}>
        <div className={s.bar} onAnimationEnd={done} />
      </div>
    </div>
  );
};

export default BootScreen;
