import type { CSSProperties } from 'react';
import type { AppId } from '@/store/os';
import { cx } from '@/utils/cx';
import { PHONE_APPS } from '../apps';
import s from './style.module.css';

interface Props {
  app: AppId;

  origin: { x: number; y: number } | null;
  closing: boolean;
  onHome: () => void;
}

const AppView = ({ app, origin, closing, onHome }: Props) => {
  const { title, Body, darkChrome, nav } = PHONE_APPS[app];
  const style = origin
    ? ({ '--ox': `${origin.x}px`, '--oy': `${origin.y}px` } as CSSProperties)
    : undefined;

  return (
    <section
      className={cx(s.app, darkChrome && s.darkChrome, closing && s.closing)}
      style={style}
      aria-label={title}
    >
      {nav && <header className={s.nav}>{title}</header>}
      <div className={s.body}>
        <Body />
      </div>
      <button
        type="button"
        className={s.home}
        onClick={onHome}
        aria-label="홈 화면으로"
      >
        <span />
      </button>
    </section>
  );
};

export default AppView;
