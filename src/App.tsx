import { useEffect, useLayoutEffect } from 'react';
import CompactOverlay from '@/components/CompactOverlay';
import DesktopOverlay from '@/components/DesktopOverlay';
import Hud from '@/components/Hud';
import PowerOn from '@/components/PowerOn';
import Home from '@/ios/Home';
import BootScreen from '@/os/BootScreen';
import Desktop from '@/os/Desktop';
import { useOS } from '@/store/os';
import Stage from '@/three/Stage';

const hasWebGL = (() => {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') ?? c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return gl !== null;
  } catch {
    return false;
  }
})();

const touch =
  typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;

function App() {
  const phase = useOS((s) => s.phase);
  const compact = useOS((s) => s.layout.mode === 'compact');

  const bare = compact && touch;

  useLayoutEffect(() => {
    const { setViewport } = useOS.getState();
    const onResize = () => setViewport(window.innerWidth, window.innerHeight);

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (phase !== 'closed' || (!bare && !hasWebGL)) return;
    const id = setTimeout(
      () => useOS.getState().setPhase(bare ? 'booting' : 'opening'),
      bare ? 300 : 700,
    );
    return () => clearTimeout(id);
  }, [phase, bare]);

  if (bare) {
    return phase === 'desktop' ? (
      <PowerOn>
        <Home />
      </PowerOn>
    ) : (
      <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
        {phase === 'booting' && <BootScreen phone />}
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div style={{ position: 'fixed', inset: 0 }}>
        {compact ? <Home /> : <Desktop compact />}
      </div>
    );
  }

  return (
    <>
      <Stage />
      <Hud />
      <CompactOverlay />
      <DesktopOverlay />
    </>
  );
}

export default App;
