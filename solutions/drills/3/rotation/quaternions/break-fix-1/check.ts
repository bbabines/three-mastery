import { expect } from 'vitest';
import { Euler, Quaternion, Vector3 } from 'three';

type Blend = (from: Euler, to: Euler, t: number) => Quaternion;

export function checkBlend(blendOrientation: Blend): void {
  const from = new Euler(0, 2.9, 0, 'YXZ');
  const to = new Euler(0, -2.9, 0, 'YXZ');
  const expected = new Quaternion().slerpQuaternions(new Quaternion().setFromEuler(from), new Quaternion().setFromEuler(to), 0.5);
  const forward = new Vector3(0, 0, -1).applyQuaternion(blendOrientation(from, to, 0.5));
  const expectedForward = new Vector3(0, 0, -1).applyQuaternion(expected);
  expect(forward.distanceTo(expectedForward)).toBeLessThan(1e-5);
}
