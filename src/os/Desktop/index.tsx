import { useOS } from '@/store/os';
import { cx } from '@/utils/cx';
import { APP_ORDER, APPS } from '../apps';
import Dock from '../Dock';
import Spotlight from '../Spotlight';
import TopBar from '../TopBar';
import Window from '../Window';
import s from './style.module.css';

export const Wallpaper = ({ dark = false }: { dark?: boolean }) => (
  <div className={cx(s.wallpaper, dark && s.night)} />
);

/**
 * 화면 하나. 노트북 화면 안(가상 해상도)에서도, 폰에서 꺼낸 전체 화면에서도 같은 컴포넌트를 쓴다.
 * compact 에서는 창을 끌 수 없고 늘 메뉴 막대와 독 사이를 꽉 채운다.
 */
const Desktop = ({ compact = false }: { compact?: boolean }) => {
  const dark = useOS((st) => st.dark);
  const brightness = useOS((st) => st.brightness);
  const anyMaximized = useOS((st) =>
    Object.values(st.windows).some(
      (w) => w.open && !w.minimized && w.maximized,
    ),
  );
  // 화면에 다가간 뒤의 배율. 가상 해상도를 그 폭에 맞췄으니 보통 1 이다.
  const scale = useOS((st) =>
    compact || st.layout.mode !== 'screen'
      ? 1
      : st.layout.rects.focus.width / st.layout.width,
  );

  return (
    <div
      className={cx(
        s.desktop,
        'os-theme',
        dark && 'os-dark',
        compact && s.compact,
      )}
      data-desktop
    >
      <Wallpaper dark={dark} />
      <TopBar compact={compact} />

      <div className={s.windows}>
        {APP_ORDER.map((id) => {
          const { title, Body } = APPS[id];
          return (
            <Window
              key={id}
              id={id}
              title={title}
              compact={compact}
              scale={scale}
            >
              <Body />
            </Window>
          );
        })}
      </div>
      <Dock compact={compact} hidden={anyMaximized && !compact} scale={scale} />
      <Spotlight />
      <div
        className={s.dim}
        style={{ opacity: ((100 - brightness) / 100) * 0.8 }}
        aria-hidden
      />
    </div>
  );
};

export default Desktop;
