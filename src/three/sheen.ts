import { CanvasTexture, SRGBColorSpace } from 'three';

export const sheenTexture = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.28, 'rgba(255,255,255,0.13)');
  grad.addColorStop(0.42, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 512);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
};
