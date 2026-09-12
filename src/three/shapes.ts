import { ExtrudeGeometry, Shape, type BufferGeometry } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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

  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo);
  geo.computeVertexNormals();
  return geo;
};
