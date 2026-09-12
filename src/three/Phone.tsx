import { useEffect, useMemo } from 'react';
import {
  AdditiveBlending,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ShapeGeometry,
} from 'three';
import { useOS } from '@/store/os';
import { PHONE, PHONE_DISPLAY, PHONE_Y } from './dims';
import PhoneScreen from './PhoneScreen';
import { sheenTexture } from './sheen';
import { roundedRect, slab } from './shapes';

const BUTTONS: [number, number, number, string?][] = [
  [-1, 0.44, 0.06],
  [-1, 0.29, 0.095],
  [-1, 0.16, 0.095],
  [1, 0.27, 0.16],
  [1, -0.12, 0.075, '#2a2b2f'],
];

const Phone = () => {
  const phase = useOS((s) => s.phase);
  const setPhase = useOS((s) => s.setPhase);

  useEffect(() => {
    if (phase !== 'opening') return;
    const id = setTimeout(() => setPhase('booting'), 900);
    return () => clearTimeout(id);
  }, [phase, setPhase]);

  const mat = useMemo(
    () => ({
      frame: new MeshStandardMaterial({
        color: '#55565b',
        metalness: 0.9,
        roughness: 0.26,
      }),
      glass: new MeshPhysicalMaterial({
        color: '#050507',
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.25,
        envMapIntensity: 0.4,
      }),
      display: new MeshStandardMaterial({
        color: '#020203',
        roughness: 0.45,
        envMapIntensity: 0.3,
      }),
    }),
    [],
  );
  const geo = useMemo(
    () => ({
      body: slab(PHONE.w, PHONE.h, PHONE.d, PHONE.r, 0.009)
        .rotateX(Math.PI / 2)
        .translate(0, 0, -PHONE.d / 2),
      glass: new ShapeGeometry(
        roundedRect(PHONE.w - 0.018, PHONE.h - 0.018, PHONE.r - 0.009),
        32,
      ),
      display: new ShapeGeometry(
        roundedRect(PHONE_DISPLAY.w, PHONE_DISPLAY.h, PHONE_DISPLAY.r),
        32,
      ),
    }),
    [],
  );
  const sheen = useMemo(() => sheenTexture(), []);

  return (
    <group position={[0, PHONE_Y, 0]}>
      <mesh geometry={geo.body} material={mat.frame} />
      <mesh
        geometry={geo.glass}
        material={mat.glass}
        position-z={PHONE.d / 2 + 0.0004}
      />
      <mesh
        geometry={geo.display}
        material={mat.display}
        position-z={PHONE.d / 2 + 0.0008}
      />
      <mesh geometry={geo.glass} position-z={PHONE.d / 2 + 0.0011}>
        <meshBasicMaterial
          map={sheen}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {BUTTONS.map(([side, y, length, color]) => (
        <mesh
          key={`${side}:${y}`}
          position={[side * (PHONE.w / 2 + 0.0015), y, 0]}
          material={color ? undefined : mat.frame}
        >
          <boxGeometry args={[0.006, length, 0.028]} />
          {color && (
            <meshStandardMaterial
              color={color}
              metalness={0.3}
              roughness={0.2}
            />
          )}
        </mesh>
      ))}
      <PhoneScreen />
    </group>
  );
};

export default Phone;
