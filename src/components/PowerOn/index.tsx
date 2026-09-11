import type { PropsWithChildren } from 'react';
import s from './style.module.css';

/** 화면이 잠깐 꺼졌다가 켜지듯, 뷰포트를 꽉 채운 까만 바탕 위로 조금 뒤에 떠오른다. */
const PowerOn = ({ children }: PropsWithChildren) => (
  <div className={s.black}>
    <div className={s.screen}>{children}</div>
  </div>
);

export default PowerOn;
