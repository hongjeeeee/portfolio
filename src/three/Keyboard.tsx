import { useMemo } from 'react';
import {
  CanvasTexture,
  SRGBColorSpace,
  ShapeGeometry,
  type BufferGeometry,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BASE, FN_ROW as FN, KEY_U as U, KEYBOARD } from './dims';
import { roundedRect, slab } from './shapes';

/** 키 사이 3mm */
const GAP = 0.03;

/** 줄마다 키 너비(u). 모두 합이 14.5u 로 같아야 좌우가 맞는다. */
const ROWS = [
  { h: FN, keys: [1.5, ...Array(12).fill(1), 1] },
  { h: 1, keys: [...Array(13).fill(1), 1.5] },
  { h: 1, keys: [1.5, ...Array(13).fill(1)] },
  { h: 1, keys: [1.75, ...Array(11).fill(1), 1.75] },
  { h: 1, keys: [2.25, ...Array(10).fill(1), 2.25] },
];
const BOTTOM = [1, 1, 1, 1.25, 5, 1.25, 1];

/** 키 80개를 한 geometry 로 합쳐 draw call 한 번에 그린다. */
const buildKeys = () => {
  const parts: BufferGeometry[] = [];
  const shapes = new Map<string, BufferGeometry>();
  const add = (x: number, z: number, w: number, d: number) => {
    const id = `${w}:${d}`;
    let g = shapes.get(id);
    if (!g) {
      g = slab(w * U - GAP, d * U - GAP, 0.012, 0.022, 0.003, 4);
      shapes.set(id, g);
    }
    parts.push(
      g
        .clone()
        .translate(
          (x + w / 2) * U - KEYBOARD.w / 2,
          0,
          (z + d / 2) * U - KEYBOARD.d / 2,
        ),
    );
  };

  let z = 0;
  for (const row of ROWS) {
    let x = 0;
    for (const w of row.keys) {
      add(x, z, w, row.h);
      x += w;
    }
    z += row.h;
  }
  let x = 0;
  for (const w of BOTTOM) {
    add(x, z, w, 1);
    x += w;
  }
  // 뒤집힌 T 자 방향키. 좌우는 아래 반 칸, 위아래는 반 칸씩 포갠다.
  add(x, z + 0.5, 1, 0.5);
  add(x + 1, z, 1, 0.5);
  add(x + 1, z + 0.5, 1, 0.5);
  add(x + 2, z + 0.5, 1, 0.5);

  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  shapes.forEach((g) => g.dispose());
  return merged;
};

/** 스피커 그릴 구멍. 엇갈린 점 격자를 캔버스에 찍어 투명 텍스처로 쓴다. */
const grilleTexture = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 640;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0b0b0c';
  for (let row = 0; row * 8 + 4 < c.height; row++) {
    for (let x = 4 + (row % 2) * 4; x < c.width; x += 8) {
      g.beginPath();
      g.arc(x, row * 8 + 4, 1.7, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const Keyboard = () => {
  const keys = useMemo(() => buildKeys(), []);
  const well = useMemo(
    () =>
      new ShapeGeometry(
        roundedRect(KEYBOARD.w + 0.03, KEYBOARD.d + 0.03, 0.03),
        8,
      ).rotateX(-Math.PI / 2),
    [],
  );
  const grille = useMemo(() => grilleTexture(), []);
  const grilleX = (KEYBOARD.w / 2 + BASE.w / 2) / 2;

  return (
    <group position={[0, BASE.h, KEYBOARD.z]}>
      <mesh geometry={well} position-y={0.0006}>
        <meshStandardMaterial color="#050506" roughness={0.9} />
      </mesh>
      <mesh geometry={keys} position-y={-0.009}>
        <meshStandardMaterial
          color="#121214"
          roughness={0.62}
          metalness={0.05}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * grilleX, 0.0008, 0]}
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[0.1, KEYBOARD.d]} />
          <meshStandardMaterial
            map={grille}
            transparent
            depthWrite={false}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Keyboard;
