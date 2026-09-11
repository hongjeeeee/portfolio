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

/** 손가락으로 쓰는 기기. 진짜 폰 안에 3D 폰을 또 세우면 어색하고 화면도 어긋나서 목업 없이 켠다. */
const touch =
  typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;

function App() {
  const phase = useOS((s) => s.phase);
  const compact = useOS((s) => s.layout.mode === 'compact');
  // 진짜 폰은 아이폰이 켜지듯 까만 화면에 표식이 떠올랐다가 홈 화면이 켜진다.
  const bare = compact && touch;

  useLayoutEffect(() => {
    const { setViewport } = useOS.getState();
    const onResize = () => setViewport(window.innerWidth, window.innerHeight);
    // 모듈을 읽을 때 창 크기가 0 이었을 수 있다(백그라운드 탭 등). 붙자마자 한 번 더 잰다.
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 닫힌 노트북을 잠깐 보여 준 뒤에 연다. 바로 열면 무엇이 열리는지 눈이 따라가지 못한다.
  // 진짜 폰은 까만 화면에서 조금 쉬었다가 표식을 띄운다.
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

  // 3D 를 못 그리는 환경에서는 화면 속 내용만 전체 화면으로 보여 준다. 폰이면 아이폰 홈 화면이다.
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
