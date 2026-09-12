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
