import { useRef, useState, type ReactNode } from 'react';
import { useNow } from '@/hooks/useNow';
import { Wallpaper } from '@/os/Desktop';
import { DOCK_ITEMS, linkTarget, type DockItemDef } from '@/os/dockItems';
import Glyph from '@/os/glyphs';
import { useOS, type AppId } from '@/store/os';
import { cx } from '@/utils/cx';
import AppView from '../AppView';
import { PHONE_APPS } from '../apps';
import Search from '../Search';
import StatusBar from '../StatusBar';
import s from './style.module.css';

const weekdayFmt = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' });
const monthFmt = new Intl.DateTimeFormat('ko-KR', { month: 'long' });

const CalendarWidget = () => {
  const now = useNow();
  return (
    <div className={s.widget}>
      <span className={s.weekday}>{weekdayFmt.format(now)}</span>
      <strong className={s.day}>{now.getDate()}</strong>
      <span className={s.month}>{monthFmt.format(now)} · 일정 없음</span>
    </div>
  );
};

interface IconProps {
  id: string;
  title: string;

  label?: boolean;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}

const HomeIcon = ({
  id,
  title,
  label = false,
  onClick,
  href,
  children,
}: IconProps) => {
  const inner = (
    <>
      <span className={s.tile}>{children}</span>
      {label && <span className={s.label}>{title}</span>}
    </>
  );
  return href ? (
    <a
      className={s.icon}
      href={href}
      target={linkTarget(href)}
      rel="noreferrer"
      data-icon={id}
      aria-label={title}
    >
      {inner}
    </a>
  ) : (
    <button
      type="button"
      className={s.icon}
      onClick={onClick}
      data-icon={id}
      aria-label={title}
    >
      {inner}
    </button>
  );
};

const Home = ({ inPhone = false }: { inPhone?: boolean }) => {
  const dark = useOS((st) => st.dark);
  const app = useOS((st) => st.phoneApp);
  const { openPhoneApp, closePhoneApp } = useOS.getState();
  const root = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [closing, setClosing] = useState(false);
  const [searching, setSearching] = useState(false);

  const originOf = (id: string) => {
    const box = root.current?.getBoundingClientRect();
    const el = root.current?.querySelector(`[data-icon="${CSS.escape(id)}"]`);
    if (!box || !el) return null;
    const r = el.getBoundingClientRect();

    const k = root.current!.offsetWidth / box.width;
    return {
      x: (r.left + r.width / 2 - box.left) * k,
      y: (r.top + r.height / 2 - box.top) * k,
    };
  };

  const launch = (id: AppId) => {
    setOrigin(originOf(id));
    setClosing(false);
    openPhoneApp(id);
  };

  const goHome = () => {
    if (!app) return;
    setOrigin(originOf(app));
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      closePhoneApp();
    }, 360);
  };

  const light = !app || dark || !!PHONE_APPS[app].darkChrome;

  const icon = ({ id, title, Icon, app, href }: DockItemDef, label = false) => (
    <HomeIcon
      key={id}
      id={id}
      title={title}
      label={label}
      onClick={app ? () => launch(app) : undefined}
      href={app ? undefined : href}
    >
      <Icon />
    </HomeIcon>
  );

  return (
    <div
      ref={root}
      className={cx(
        s.home,
        'os-theme',
        dark && 'os-dark',
        inPhone && s.inPhone,
      )}
    >
      <Wallpaper dark={dark} />
      <StatusBar light={light} island={inPhone} />

      <div className={cx(s.springboard, app && !closing && s.away)}>
        <div className={s.grid}>
          <CalendarWidget />
          {DOCK_ITEMS.filter((d) => d.home).map((d) => icon(d, true))}
        </div>

        <button
          type="button"
          className={s.searchPill}
          onClick={() => setSearching(true)}
        >
          <Glyph name="search" strokeWidth={2.6} />
          검색
        </button>

        <nav className={s.dock} aria-label="독">
          {DOCK_ITEMS.filter((d) => !d.home).map((d) => icon(d))}
        </nav>
      </div>

      {app && (
        <AppView
          key={app}
          app={app}
          origin={origin}
          closing={closing}
          onHome={goHome}
        />
      )}
      {searching && (
        <Search
          onPick={() => setOrigin(null)}
          onClose={() => setSearching(false)}
        />
      )}
    </div>
  );
};

export default Home;
