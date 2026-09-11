import type { Vector3 } from 'three';

/**
 * Unity 의 SmoothDamp. 속도 0 에서 출발해 가속했다가 감속한다.
 * 지수 감쇠(lerp)는 첫 프레임에 튀어 나가서 뚜껑이 기계처럼 열린다.
 */
const factors = (smoothTime: number, dt: number) => {
  const omega = 2 / smoothTime;
  const x = omega * dt;
  return { omega, exp: 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x) };
};

export const smoothDamp = (
  current: number,
  target: number,
  vel: { v: number },
  smoothTime: number,
  dt: number,
) => {
  const { omega, exp } = factors(smoothTime, dt);
  const change = current - target;
  const temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  return target + (change + temp) * exp;
};

export const smoothDampVec3 = (
  current: Vector3,
  target: Vector3,
  vel: Vector3,
  smoothTime: number,
  dt: number,
) => {
  const { omega, exp } = factors(smoothTime, dt);
  for (const k of ['x', 'y', 'z'] as const) {
    const change = current[k] - target[k];
    const temp = (vel[k] + omega * change) * dt;
    vel[k] = (vel[k] - omega * temp) * exp;
    current[k] = target[k] + (change + temp) * exp;
  }
};
