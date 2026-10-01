import { expect } from 'vitest';
import { ArrowHelper, Object3D, Vector3 } from 'three';

type Draw = (parent: Object3D, origin: Vector3, direction: Vector3) => ArrowHelper;

export function checkWorldRay(draw: Draw): void {
  const parent = new Object3D(); parent.position.set(4, 0, -2); parent.rotation.y = 0.8;
  const origin = new Vector3(1, 2, 3);
  const arrow = draw(parent, origin, new Vector3(1, 0, 0));
  parent.updateMatrixWorld(true);
  expect(arrow.getWorldPosition(new Vector3()).distanceTo(origin), 'the arrow starts at the world ray origin').toBeLessThan(1e-6);
}
