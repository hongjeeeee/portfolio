import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useOS } from '@/store/os';
import CameraRig from './CameraRig';
import { FOV } from './dims';
import MacBook from './MacBook';
import Phone from './Phone';

/**
 * 넓은 화면에는 맥북, 폰에는 아이폰을 세운다.
 * 외부 HDR 없이 Lightformer 로 스튜디오 조명을 만든다.
 * 금속 재질은 비치는 환경이 전부라, 판 조명 몇 장의 위치가 곧 알루미늄의 인상이다.
 */
const Stage = () => {
  const compact = useOS((s) => s.layout.mode === 'compact');
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ fov: FOV, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true }}
      style={{ overflow: 'clip' }}
    >
      <CameraRig />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 4]} intensity={0.6} />
      {compact ? <Phone /> : <MacBook />}
      <ContactShadows
        position={[0, -0.002, 0]}
        scale={8}
        blur={2.6}
        far={1.6}
        opacity={0.65}
        resolution={512}
      />
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 6, 0]}
          scale={[10, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-6, 2, 1]}
          scale={[3, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[6, 2, -1]}
          scale={[3, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[0, 1, 8]}
          scale={[10, 2, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          position={[-3, 4, -6]}
          scale={3}
          target={[0, 0, 0]}
        />
      </Environment>
    </Canvas>
  );
};

export default Stage;
