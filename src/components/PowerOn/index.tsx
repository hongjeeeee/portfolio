import type { PropsWithChildren } from 'react';
import s from './style.module.css';

const PowerOn = ({ children }: PropsWithChildren) => (
  <div className={s.black}>
    <div className={s.screen}>{children}</div>
  </div>
);

export default PowerOn;
