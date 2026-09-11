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
 * macOS 화면 하나. 맥북에 다가간 뒤 뷰포트를 꽉 채운 화면(DesktopOverlay)과, 3D 를 못 그릴 때의 대체 화면에서 쓴다.
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
            <Window key={id} id={id} title={title} compact={compact}>
              <Body />
            </Window>
          );
        })}
      </div>
      <Dock compact={compact} hidden={anyMaximized && !compact} />
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
