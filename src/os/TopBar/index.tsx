import { useRef, useState } from 'react';
import { useNow } from '@/hooks/useNow';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import { APPS } from '../apps';
import Glyph from '../glyphs';
import { LogoGlyph } from '../icons';
import Battery from './Battery';
import ControlCenter from './ControlCenter';
import { LogoMenu, WifiMenu } from './Menus';
import s from './style.module.css';

const dateFmt = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});
const timeFmt = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  minute: '2-digit',
});

/** 모양만 내는 메뉴. 실제로 동작하는 건 왼쪽 표식 메뉴다. */
const DECOR = ['파일', '편집', '보기', '윈도우', '도움말'];

type Menu = 'logo' | 'wifi' | 'cc' | null;

const TopBar = ({ compact }: { compact: boolean }) => {
  const focused = useOS((st) => st.focused);
  const wifi = useOS((st) => st.wifi);
  const spotlight = useOS((st) => st.spotlight);
  const setSpotlight = useOS((st) => st.setSpotlight);
  const [menu, setMenu] = useState<Menu>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const wifiRef = useRef<HTMLButtonElement>(null);
  const ccRef = useRef<HTMLButtonElement>(null);
  const now = useNow();

  const toggle = (next: Menu) => setMenu((m) => (m === next ? null : next));
  const close = () => setMenu(null);

  return (
    <header className={cx(s.bar, compact && s.compact)}>
      <div className={s.side}>
        <button
          ref={logoRef}
          type="button"
          className={cx(s.item, s.logo, menu === 'logo' && s.active)}
          onClick={() => toggle('logo')}
          aria-label="메뉴"
        >
          <LogoGlyph className={s.logoGlyph} />
        </button>
        <span className={cx(s.item, s.app)}>
          {focused ? APPS[focused].title : 'Finder'}
        </span>
        {!compact &&
          DECOR.map((label) => (
            <span key={label} className={s.item}>
              {label}
            </span>
          ))}
      </div>

      {!compact && (
        <div className={s.notch} aria-hidden>
          <span className={s.camera} />
        </div>
      )}

      <div className={s.side}>
        {!compact && (
          <span className={s.item}>
            <Battery />
          </span>
        )}
        <button
          ref={wifiRef}
          type="button"
          className={cx(s.item, menu === 'wifi' && s.active)}
          onClick={() => toggle('wifi')}
          aria-label="Wi-Fi"
        >
          <Glyph name={wifi ? 'wifi' : 'wifiOff'} className={s.icon} />
        </button>
        <button
          type="button"
          className={cx(s.item, spotlight && s.active)}
          onClick={() => setSpotlight(!spotlight)}
          aria-label="Spotlight"
        >
          <Glyph name="search" className={s.icon} strokeWidth={2.2} />
        </button>
        <button
          ref={ccRef}
          type="button"
          className={cx(s.item, menu === 'cc' && s.active)}
          onClick={() => toggle('cc')}
          aria-label="제어 센터"
        >
          <Glyph name="controlCenter" className={s.icon} />
        </button>
        <span className={cx(s.item, s.clock)}>
          {!compact && <span>{dateFmt.format(now)}</span>}
          <time>{timeFmt.format(now)}</time>
        </span>
      </div>

      {menu === 'logo' && <LogoMenu onClose={close} ignore={[logoRef]} />}
      {menu === 'wifi' && <WifiMenu onClose={close} ignore={[wifiRef]} />}
      {menu === 'cc' && <ControlCenter onClose={close} ignore={[ccRef]} />}
    </header>
  );
};

export default TopBar;
