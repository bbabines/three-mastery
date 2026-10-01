import { expect } from 'vitest';
import { Object3D, Vector3 } from 'three';

type Convert = (part: Object3D, worldHit: Vector3) => Vector3;

export function checkInverse(localHit: Convert): void {
  const part = new Object3D();
  part.position.set(-3, 1, 2);
  part.rotation.y = 0.4;
  part.scale.set(2, 0.8, 1.2);
  const world = part.localToWorld(new Vector3(0.3, 0.2, -0.4));
  const local = localHit(part, world);
  expect(part.localToWorld(local).distanceTo(world)).toBeLessThan(1e-5);
}
