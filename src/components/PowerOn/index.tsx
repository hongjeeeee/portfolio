import type { CSSProperties, PropsWithChildren } from 'react';
import s from './style.module.css';

/* style 로 --t/--r/--b/--l/--radius 를 주면 그 사각형에서 전체 화면으로 펼쳐진다 */
const PowerOn = ({
  children,
  style,
}: PropsWithChildren<{ style?: CSSProperties }>) => (
  <div className={s.black} style={style}>
    <div className={s.screen}>{children}</div>
  </div>
);

export default PowerOn;
