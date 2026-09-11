import type { CSSProperties } from 'react';
import type { AppId } from '@/store/os';
import { cx } from '@/utils/cx';
import { PHONE_APPS } from '../apps';
import s from './style.module.css';

interface Props {
  app: AppId;
  /** 누른 아이콘의 가운데(홈 화면 기준 px). 없으면 화면 가운데에서 열린다. */
  origin: { x: number; y: number } | null;
  closing: boolean;
  onHome: () => void;
}

/** 아이콘 자리에서 커지며 열리고, 홈 막대를 누르면 그 자리로 줄어들며 닫힌다. */
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
