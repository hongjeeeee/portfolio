import { CanvasTexture, SRGBColorSpace } from 'three';

/**
 * 꺼진 화면 위를 비스듬히 지나가는 빛. 환경광만 비치면 위아래로 반이 갈려 띠처럼 보여서,
 * 반사는 줄이고 사선 그라데이션을 더해 유리 느낌을 낸다. 맥북 · 아이폰이 같이 쓴다.
 */
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
