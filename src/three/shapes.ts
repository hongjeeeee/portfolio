import { ExtrudeGeometry, Shape, type BufferGeometry } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** 가운데가 원점인 둥근 사각형 (XY 평면) */
export const roundedRect = (w: number, h: number, r: number) => {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
};

/**
 * 모서리가 둥글고 테두리가 깎인 판. XZ 평면에 놓이고 y 는 0 부터 h 까지다.
 * RoundedBox 는 반지름 하나를 모든 모서리에 써서 얇은 판의 평면 모서리가 뾰족해진다.
 */
export const slab = (
  w: number,
  d: number,
  h: number,
  r: number,
  bevel: number,
  segments = 24,
): BufferGeometry => {
  let geo: BufferGeometry = new ExtrudeGeometry(
    roundedRect(w - bevel * 2, d - bevel * 2, Math.max(r - bevel, 0.001)),
    {
      depth: h - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: segments,
    },
  );
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  // Extrude 결과는 면마다 꼭짓점을 따로 가져 모서리가 각져 보인다. 합쳐서 법선을 다시 구한다.
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo);
  geo.computeVertexNormals();
  return geo;
};
