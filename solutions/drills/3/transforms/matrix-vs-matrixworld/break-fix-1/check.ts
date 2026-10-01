import { expect } from 'vitest';
import { Object3D, Vector3 } from 'three';

type Reparent = (part: Object3D, newParent: Object3D) => Vector3;

export function checkReparent(moveWithoutJump: Reparent): void {
  const oldParent = new Object3D();
  oldParent.position.set(4, 1, -2);
  const newParent = new Object3D();
  newParent.position.set(-3, 2, 5);
  newParent.rotation.y = 0.6;
  const part = new Object3D();
  part.position.set(0.3, 0.2, 0.1);
  oldParent.add(part);
  const before = part.getWorldPosition(new Vector3());
  expect(moveWithoutJump(part, newParent).distanceTo(before)).toBeLessThan(1e-5);
  expect(part.parent).toBe(newParent);
}
