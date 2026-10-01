import { expect } from 'vitest';
import { Object3D, Vector3 } from 'three';

type Locate = (part: Object3D) => Vector3;

export function checkLamp(lampPosition: Locate): void {
  const parent = new Object3D();
  parent.position.set(-3, 1, 4);
  parent.rotation.y = 0.7;
  const part = new Object3D();
  part.position.set(0.8, 0.2, 0);
  parent.add(part);
  const expected = part.getWorldPosition(new Vector3());
  expect(lampPosition(part).distanceTo(expected)).toBeLessThan(1e-5);
}
