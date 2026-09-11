import { useBattery } from '@/hooks/useBattery';
import { useNow } from '@/hooks/useNow';
import Glyph from '@/os/glyphs';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import s from './style.module.css';

const timeFmt = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
});

const Signal = () => (
  <svg className={s.signal} viewBox="0 0 18 12" aria-hidden>
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={i * 4.7}
        y={9 - i * 3}
        width="3.2"
        height={3 + i * 3}
        rx="1"
        fill="currentColor"
      />
    ))}
  </svg>
);

const Battery = () => {
  const { level, charging } = useBattery();
  const tone = charging ? '#34c759' : level < 0.2 ? '#ff3b30' : 'currentColor';
  return (
    <svg className={s.battery} viewBox="0 0 27 13" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="12"
        rx="3.6"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".4"
      />
      <rect
        x="2"
        y="2"
        width={Math.max(2, 20 * level)}
        height="9"
        rx="2.2"
        fill={tone}
      />
      <path
        d="M25 4.5v4a2.2 2.2 0 0 0 0-4z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  );
};

/**
 * light 면 흰 글자(바탕화면 · 어두운 앱), 아니면 검은 글자.
 * 다이내믹 아일랜드는 3D 아이폰 화면에만 그린다. 진짜 폰에는 진짜가 있다.
 */
const StatusBar = ({ light, island }: { light: boolean; island: boolean }) => {
  const now = useNow();
  const wifi = useOS((st) => st.wifi);

  return (
    <div className={cx(s.bar, light ? s.light : s.dark)}>
      <time className={s.time}>{timeFmt.format(now)}</time>
      {island && <span className={s.island} aria-hidden />}
      <span className={s.right}>
        <Signal />
        {wifi && <Glyph name="wifi" className={s.wifi} strokeWidth={2.4} />}
        <Battery />
      </span>
    </div>
  );
};

export default StatusBar;
