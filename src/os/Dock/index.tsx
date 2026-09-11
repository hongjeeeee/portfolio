import { useRef, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import { DOCK_ITEMS, linkTarget } from '../dockItems';
import s from './style.module.css';

/** 아이콘 기본 크기와, 마우스 바로 아래에서 커지는 배율 */
const SIZE = 30;
const MAG = 2;

// 확대 곡선은 playground-macos(Renovamen, MIT) 의 독에서 가져왔다.
const LIMIT = SIZE * 6;
const INPUT = [
  -LIMIT,
  -LIMIT / (MAG * 0.65),
  -LIMIT / (MAG * 0.85),
  0,
  LIMIT / (MAG * 0.85),
  LIMIT / (MAG * 0.65),
  LIMIT,
];
const OUTPUT = [
  SIZE,
  SIZE * MAG * 0.55,
  SIZE * MAG * 0.75,
  SIZE * MAG,
  SIZE * MAG * 0.75,
  SIZE * MAG * 0.55,
  SIZE,
];

interface ItemProps {
  id: string;
  title: string;
  mouseX: MotionValue<number | null>;
  scale: number;
  magnify: boolean;
  running?: boolean;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}

const DockItem = ({
  id,
  title,
  mouseX,
  scale,
  magnify,
  running,
  onClick,
  href,
  children,
}: ItemProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const distance = useMotionValue(LIMIT + 1);
  const size = useSpring(useTransform(distance, INPUT, OUTPUT), {
    stiffness: 1700,
    damping: 90,
  });
  const fontSize = useTransform(size, (v) => `${v}px`);

  // 마우스와 아이콘 가운데의 거리. 화면 속 DOM 은 3D 로 배율이 걸려 있어 그만큼 나눈다.
  useAnimationFrame(() => {
    const el = ref.current;
    const x = mouseX.get();
    if (!magnify || !el || x === null) {
      distance.set(LIMIT + 1);
      return;
    }
    const r = el.getBoundingClientRect();
    distance.set((x - (r.left + r.width / 2)) / scale);
  });

  const icon = (
    <motion.span
      ref={ref}
      className={s.icon}
      style={magnify ? { fontSize } : undefined}
    >
      {children}
    </motion.span>
  );

  return (
    <li className={s.item} data-dock={id}>
      <span className={s.tip}>{title}</span>
      {href ? (
        <a
          href={href}
          target={linkTarget(href)}
          rel="noreferrer"
          aria-label={title}
        >
          {icon}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={title}>
          {icon}
        </button>
      )}
      <span className={cx(s.dot, running && s.running)} />
    </li>
  );
};

const Dock = ({
  compact,
  hidden,
  scale,
}: {
  compact: boolean;
  hidden: boolean;
  scale: number;
}) => {
  const windows = useOS((st) => st.windows);
  const { open } = useOS.getState();
  const mouseX = useMotionValue<number | null>(null);
  const magnify = !compact;

  return (
    <nav
      className={cx(s.dock, compact && s.compact, hidden && s.hidden)}
      aria-label="독"
    >
      <ul
        className={s.shelf}
        onPointerMove={(e) =>
          e.pointerType === 'mouse' && mouseX.set(e.clientX)
        }
        onPointerLeave={() => mouseX.set(null)}
      >
        {DOCK_ITEMS.map(({ id, title, Icon, app, href }) => (
          <DockItem
            key={id}
            id={id}
            title={title}
            mouseX={mouseX}
            scale={scale}
            magnify={magnify}
            running={app ? windows[app].open : false}
            onClick={app ? () => open(app) : undefined}
            href={app ? undefined : href}
          >
            <Icon />
          </DockItem>
        ))}
      </ul>
    </nav>
  );
};

export default Dock;
