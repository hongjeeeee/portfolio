import { useBattery } from '@/hooks/useBattery';
import s from './style.module.css';

const Battery = () => {
  const { level, charging } = useBattery();
  const tone = charging ? '#4cd964' : level < 0.2 ? '#ff453a' : 'currentColor';

  return (
    <span className={s.battery}>
      <span>{Math.round(level * 100)}%</span>
      <svg viewBox="0 0 26 12" aria-hidden>
        <rect
          x="0.75"
          y="0.75"
          width="21.5"
          height="10.5"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".5"
        />
        <rect
          x="2.5"
          y="2.5"
          width={Math.max(1.5, 18 * level)}
          height="7"
          rx="1.6"
          fill={tone}
        />
        <path d="M24 4v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity=".5" />
        {charging && <path d="M12.5 2 8.5 7h3l-1 3 4-5h-3z" fill="#fff" />}
      </svg>
    </span>
  );
};

export default Battery;
