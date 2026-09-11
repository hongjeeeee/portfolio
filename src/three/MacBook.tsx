import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  MeshStandardMaterial,
  ShapeGeometry,
  type Group,
  type PointLight,
} from 'three';
import { useOS } from '@/store/os';
import {
  BASE,
  DISPLAY,
  DISPLAY_Z,
  HINGE,
  KEYBOARD,
  LID,
  OPEN_ANGLE,
} from './dims';
import Keyboard from './Keyboard';
import Screen from './Screen';
import { sheenTexture } from './sheen';
import { roundedRect, slab } from './shapes';
import { smoothDamp } from './smoothDamp';

const TRACKPAD = {
  w: 1.36,
  d: 0.8,
  z: KEYBOARD.z + KEYBOARD.d / 2 + 0.1 + 0.4,
};

const MacBook = () => {
  const phase = useOS((s) => s.phase);
  const invalidate = useThree((s) => s.invalidate);
  const lid = useRef<Group>(null);
  const glow = useRef<PointLight>(null);
  const angle = useRef(phase === 'desktop' ? OPEN_ANGLE : 0);
  const vel = useRef({ v: 0 });

  const alu = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#7e8085',
        metalness: 0.9,
        roughness: 0.38,
      }),
    [],
  );
  const geo = useMemo(
    () => ({
      base: slab(BASE.w, BASE.d, BASE.h, BASE.r, 0.014),
      // 뚜껑은 힌지 축(원점)에서 +z 로 뻗고, 두께 가운데가 축에 온다.
      lid: slab(BASE.w, BASE.d, LID.t, BASE.r, 0.01).translate(
        0,
        -LID.t / 2,
        BASE.d / 2 - LID.t / 2,
      ),
      bezel: new ShapeGeometry(
        roundedRect(BASE.w - 0.024, BASE.d - 0.024, BASE.r - 0.012),
        16,
      ),
      trackpad: new ShapeGeometry(
        roundedRect(TRACKPAD.w, TRACKPAD.d, 0.045),
        8,
      ),
      trackpadEdge: new ShapeGeometry(
        roundedRect(TRACKPAD.w + 0.008, TRACKPAD.d + 0.008, 0.049),
        8,
      ),
    }),
    [],
  );

  const sheen = useMemo(() => sheenTexture(), []);

  useEffect(() => invalidate(), [phase, invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const open =
      phase === 'opening' || phase === 'booting' || phase === 'desktop';
    const goal = open ? OPEN_ANGLE : 0;
    angle.current = smoothDamp(
      angle.current,
      goal,
      vel.current,
      open ? 0.42 : 0.3,
      dt,
    );
    lid.current!.rotation.x = -angle.current;

    const { setPhase } = useOS.getState();
    // 다 열리기 조금 전에 화면을 켠다. 실제 맥북도 뚜껑을 여는 중에 켜진다.
    if (phase === 'opening' && angle.current > OPEN_ANGLE * 0.8) {
      setPhase('booting');
    }
    if (phase === 'closing' && angle.current < 0.004) {
      angle.current = 0;
      vel.current.v = 0;
      setPhase('asleep');
    }

    // 켜진 화면이 키보드를 은은하게 비춘다.
    const light = glow.current!;
    const on = phase === 'booting' || phase === 'desktop';
    const target = on ? 0.8 : 0;
    light.intensity += (target - light.intensity) * (1 - Math.exp(-5 * dt));

    const settled =
      Math.abs(angle.current - goal) < 1e-4 &&
      Math.abs(vel.current.v) < 1e-4 &&
      Math.abs(light.intensity - target) < 1e-3;
    if (!settled) invalidate();
  });

  return (
    <group>
      <mesh geometry={geo.base} material={alu} />
      <Keyboard />

      {/* 트랙패드: 알루미늄과 같은 색의 유리. 테두리만 살짝 어둡다. */}
      <group
        position={[0, BASE.h + 0.0005, TRACKPAD.z]}
        rotation-x={-Math.PI / 2}
      >
        <mesh geometry={geo.trackpadEdge}>
          <meshStandardMaterial
            color="#3a3b3f"
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
        <mesh geometry={geo.trackpad} position-z={0.0004}>
          <meshStandardMaterial
            color="#74767b"
            metalness={0.7}
            roughness={0.42}
          />
        </mesh>
      </group>

      {/* 앞쪽 가운데 뚜껑을 여는 손가락 홈 */}
      <mesh position={[0, BASE.h - 0.004, BASE.d / 2 - 0.004]}>
        <boxGeometry args={[0.46, 0.008, 0.012]} />
        <meshStandardMaterial color="#a2a4a9" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 뚜껑은 힌지 축을 중심으로 돈다 */}
      <group ref={lid} position={HINGE}>
        <mesh geometry={geo.lid} material={alu} />
        <mesh
          geometry={geo.bezel}
          position={[0, -LID.t / 2 - 0.0006, BASE.d / 2 - LID.t / 2]}
          rotation-x={Math.PI / 2}
        >
          <meshPhysicalMaterial
            color="#050506"
            roughness={0.28}
            clearcoat={0.7}
            clearcoatRoughness={0.12}
            envMapIntensity={0.45}
          />
        </mesh>
        <mesh
          position={[0, -LID.t / 2 - 0.0012, DISPLAY_Z]}
          rotation-x={Math.PI / 2}
        >
          <planeGeometry args={[DISPLAY.w, DISPLAY.h]} />
          <meshStandardMaterial
            color="#030304"
            roughness={0.4}
            envMapIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[0, -LID.t / 2 - 0.0016, DISPLAY_Z]}
          rotation-x={Math.PI / 2}
        >
          <planeGeometry args={[DISPLAY.w, DISPLAY.h]} />
          <meshBasicMaterial
            map={sheen}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        {/* 힌지 덮개 */}
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[LID.t / 2, LID.t / 2, BASE.w - 0.36, 24]} />
          <meshStandardMaterial
            color="#1b1b1e"
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
        <pointLight
          ref={glow}
          position={[0, -0.6, DISPLAY_Z - 0.2]}
          intensity={0}
          distance={3.2}
          decay={2}
          color="#cfe0ff"
        />
        <Screen />
      </group>
    </group>
  );
};

export default MacBook;
