import { useRef, type ReactNode, type RefObject } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import s from './style.module.css';

export interface MenuProps {
  onClose: () => void;

  ignore: RefObject<HTMLElement | null>[];
}

const Item = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <li>
    <button type="button" className={s.menuItem} onClick={onClick}>
      {children}
    </button>
  </li>
);

export const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) => (
  <label className={s.switch}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
    />
    <span />
  </label>
);

export const LogoMenu = ({ onClose, ignore }: MenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, ignore);
  const { sleep } = useOS.getState();
  const run = (action?: () => void) => () => {
    onClose();
    action?.();
  };

  return (
    <div ref={ref} className={cx(s.menu, s.logoMenu)} role="menu">
      <ul className={s.group}>
        <Item onClick={run()}>이 Mac에 관하여</Item>
      </ul>
      <ul className={s.group}>
        <Item onClick={run()}>시스템 설정…</Item>
      </ul>
      <ul className={s.group}>
        <Item onClick={run()}>최근 사용 항목</Item>
      </ul>
      <ul className={s.group}>
        <Item onClick={run()}>강제 종료…</Item>
      </ul>
      <ul className={s.group}>
        <Item onClick={run(sleep)}>잠자기</Item>
        <Item onClick={run(() => location.reload())}>다시 시작…</Item>
        <Item onClick={run(sleep)}>시스템 종료…</Item>
      </ul>
    </div>
  );
};

export const WifiMenu = ({ onClose, ignore }: MenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, ignore);
  const wifi = useOS((st) => st.wifi);
  const toggle = useOS((st) => st.toggle);

  return (
    <div ref={ref} className={cx(s.menu, s.wifiMenu)}>
      <strong>Wi-Fi</strong>
      <Switch checked={wifi} onChange={() => toggle('wifi')} label="Wi-Fi" />
    </div>
  );
};
