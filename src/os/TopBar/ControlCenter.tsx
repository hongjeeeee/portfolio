import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import Glyph, { type GlyphName } from '../glyphs';
import type { MenuProps } from './Menus';
import s from './style.module.css';

const Toggle = ({
  icon,
  title,
  sub,
  on,
  onClick,
}: {
  icon: GlyphName;
  title: string;
  sub: string;
  on: boolean;
  onClick: () => void;
}) => (
  <div className={s.toggle}>
    <button
      type="button"
      className={cx(s.round, on && s.on)}
      onClick={onClick}
      aria-pressed={on}
      aria-label={title}
    >
      <Glyph name={icon} />
    </button>
    <div>
      <strong>{title}</strong>
      <small>{sub}</small>
    </div>
  </div>
);

const Slider = ({
  icon,
  value,
  onChange,
  label,
}: {
  icon: GlyphName;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) => (
  <label className={s.slider} style={{ '--v': `${value}%` } as CSSProperties}>
    <Glyph name={icon} className={s.sliderIcon} />
    <input
      type="range"
      min={1}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
    />
  </label>
);

/** 전체 화면은 브라우저 창이 바뀌는 것이라, 상태를 스토어가 아니라 문서에서 읽는다. */
const useFullscreen = () => {
  const [full, setFull] = useState(() => !!document.fullscreenElement);
  useEffect(() => {
    const onChange = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggle = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen?.();
  return [full, toggle] as const;
};

const ControlCenter = ({ onClose, ignore }: MenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, ignore);
  const wifi = useOS((st) => st.wifi);
  const bluetooth = useOS((st) => st.bluetooth);
  const airdrop = useOS((st) => st.airdrop);
  const dark = useOS((st) => st.dark);
  const brightness = useOS((st) => st.brightness);
  const volume = useOS((st) => st.volume);
  const { toggle, toggleDark, setBrightness, setVolume } = useOS.getState();
  const [full, toggleFull] = useFullscreen();

  return (
    <div ref={ref} className={s.cc}>
      <div className={cx(s.tile, s.connect)}>
        <Toggle
          icon="wifi"
          title="Wi-Fi"
          sub={wifi ? '연결됨' : '끔'}
          on={wifi}
          onClick={() => toggle('wifi')}
        />
        <Toggle
          icon="bluetooth"
          title="Bluetooth"
          sub={bluetooth ? '켬' : '끔'}
          on={bluetooth}
          onClick={() => toggle('bluetooth')}
        />
        <Toggle
          icon="airdrop"
          title="AirDrop"
          sub={airdrop ? '연락처만' : '끔'}
          on={airdrop}
          onClick={() => toggle('airdrop')}
        />
      </div>
      <div className={cx(s.tile, s.wide)}>
        <button
          type="button"
          className={cx(s.round, dark && s.on)}
          onClick={toggleDark}
          aria-pressed={dark}
          aria-label="다크 모드"
        >
          <Glyph name={dark ? 'moon' : 'sun'} />
        </button>
        <strong>{dark ? '다크 모드' : '라이트 모드'}</strong>
      </div>
      <div className={cx(s.tile, s.small)}>
        <Glyph name="keyboardLight" className={s.bigGlyph} />
        <small>키보드 밝기</small>
      </div>
      <button
        type="button"
        className={cx(s.tile, s.small)}
        onClick={toggleFull}
      >
        <Glyph
          name={full ? 'fullscreenExit' : 'fullscreen'}
          className={s.bigGlyph}
        />
        <small>{full ? '전체 화면 끝내기' : '전체 화면'}</small>
      </button>
      <div className={cx(s.tile, s.row)}>
        <strong>디스플레이</strong>
        <Slider
          icon="sun"
          value={brightness}
          onChange={setBrightness}
          label="밝기"
        />
      </div>
      <div className={cx(s.tile, s.row)}>
        <strong>사운드</strong>
        <Slider
          icon="volume"
          value={volume}
          onChange={setVolume}
          label="음량"
        />
      </div>
    </div>
  );
};

export default ControlCenter;
