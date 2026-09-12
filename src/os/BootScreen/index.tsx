import { useOS } from '@/store/os';
import { LogoGlyph } from '../icons';
import s from './style.module.css';

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
