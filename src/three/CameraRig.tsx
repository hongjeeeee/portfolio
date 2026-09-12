import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useOS } from '@/store/os';
import { fit, startPose, subjectFor } from './pose';
import { smoothDampVec3 } from './smoothDamp';

const ARRIVE_SQ = 0.03 ** 2;

const expandIfReady = (arrived: boolean) => {
  const st = useOS.getState();
  if (arrived && st.phase === 'desktop' && st.zoom === 1 && !st.expanded) {
    st.setExpanded(true);
  }
};

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
      camera.position.copy(goal.position);
      look.current.copy(goal.target);
    }
    camera.lookAt(look.current);
    if (moving) invalidate();
  });

  return null;
};

export default CameraRig;
