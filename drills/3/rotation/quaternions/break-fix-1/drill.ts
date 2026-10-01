import { Euler, Quaternion } from 'three';

// Blend two Euler orientations into a quaternion along the shortest turn.
export function blendOrientation(from: Euler, to: Euler, t: number): Quaternion {
  const angles = new Euler(
    from.x + (to.x - from.x) * t,
    from.y + (to.y - from.y) * t,
    from.z + (to.z - from.z) * t,
    from.order,
  );
  return new Quaternion().setFromEuler(angles);
}
