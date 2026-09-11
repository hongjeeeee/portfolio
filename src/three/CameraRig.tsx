import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useOS } from '@/store/os';
import { fit, startPose, subjectFor } from './pose';
import { smoothDampVec3 } from './smoothDamp';

/**
 * 이만큼(3mm) 안으로 들어오면 눈으로는 다 다가간 것이다.
 * 끝까지 맞추려면 몇 초 더 걸리지만, 그동안 기다리게 하면 부팅 화면에서 멈춘 것처럼 보인다.
 */
const ARRIVE_SQ = 0.03 ** 2;

/** 부팅이 끝났고(desktop) 카메라도 다 왔으면, 3D 화면 대신 뷰포트를 꽉 채운 진짜 화면으로 바꿔 끼운다. */
const expandIfReady = (arrived: boolean) => {
  const st = useOS.getState();
  if (arrived && st.phase === 'desktop' && st.zoom === 1 && !st.expanded) {
    st.setExpanded(true);
  }
};

/**
 * 단계와 시점에 맞는 자리로 카메라를 부드럽게 옮긴다.
 * frameloop 가 demand 라 움직이는 동안만 다음 프레임을 요청한다.
 */
const CameraRig = () => {
  const camera = useThree((s) => s.camera);
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  const phase = useOS((s) => s.phase);
  const zoom = useOS((s) => s.zoom);
  const mode = useOS((s) => s.layout.mode);

  const poses = useMemo(() => {
    const subject = subjectFor(mode);
    const aspect = width / height;
    const overview = fit(subject, aspect, 'overview');
    return {
      overview: overview.pose,
      focus: fit(subject, aspect, 'focus').pose,
      start: startPose(subject, overview.dist),
    };
  }, [width, height, mode]);

  const awake =
    phase === 'opening' || phase === 'booting' || phase === 'desktop';
  // 두 자리 모두 화면을 수직으로 보므로, 그 사이 어디서 멈춰도 화면과 평행하다.
  const goal = useMemo(() => {
    if (!awake) return poses.start;
    const { overview: a, focus: b } = poses;
    return {
      position: a.position.clone().lerp(b.position, zoom),
      target: a.target.clone().lerp(b.target, zoom),
    };
  }, [awake, poses, zoom]);

  const look = useRef(new Vector3());
  const velPos = useRef(new Vector3());
  const velLook = useRef(new Vector3());
  const snapped = useRef<string | null>(null);
  const arrived = useRef(false);

  // 처음 한 번, 그리고 창 크기가 바뀔 때는 애니메이션 없이 바로 옮긴다.
  // 가상 해상도가 즉시 바뀌므로 카메라가 따라오는 동안 글자 배율이 어긋나 보이기 때문이다.
  useLayoutEffect(() => {
    const key = `${width}x${height}`;
    if (snapped.current === key) return;
    snapped.current = key;
    camera.position.copy(goal.position);
    look.current.copy(goal.target);
    velPos.current.set(0, 0, 0);
    velLook.current.set(0, 0, 0);
    camera.lookAt(look.current);
    invalidate();
  }, [camera, goal, width, height, invalidate]);

  useEffect(() => invalidate(), [goal, invalidate]);

  // 카메라가 먼저 다 왔으면, 부팅 막대가 다 차는 순간(desktop) 바로 바꿔 끼운다.
  useEffect(() => expandIfReady(arrived.current), [phase]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const smooth = phase === 'opening' ? 0.7 : 0.55;
    smoothDampVec3(camera.position, goal.position, velPos.current, smooth, dt);
    smoothDampVec3(look.current, goal.target, velLook.current, smooth, dt);

    arrived.current =
      camera.position.distanceToSquared(goal.position) < ARRIVE_SQ &&
      look.current.distanceToSquared(goal.target) < ARRIVE_SQ;
    expandIfReady(arrived.current);

    const moving =
      camera.position.distanceToSquared(goal.position) > 1e-10 ||
      look.current.distanceToSquared(goal.target) > 1e-10 ||
      velPos.current.lengthSq() > 1e-10;
    if (!moving) {
      // 마지막엔 정확히 맞춘다. 화면과 평행해야 DOM 이 선명하다.
      camera.position.copy(goal.position);
      look.current.copy(goal.target);
    }
    camera.lookAt(look.current);
    if (moving) invalidate();
  });

  return null;
};

export default CameraRig;
