import { expect } from 'vitest';
import { Object3D, Vector3 } from 'three';

type Anchor = (part: Object3D, newPosition: Vector3, anchorLocal: Vector3) => Vector3;

export function checkAnchor(movedAnchor: Anchor): void {
  const parent = new Object3D();
  parent.position.set(2, 0, 1);
  const part = new Object3D();
  part.pivot = new Vector3(-0.4, 0, 0);
  part.rotation.y = 0.6;
  parent.add(part);
  parent.updateMatrixWorld(true);
  const anchor = part.pivot.clone();
  const actual = movedAnchor(part, new Vector3(1.2, 0.5, 0), anchor);
  const expected = part.localToWorld(anchor.clone());
  expect(actual.distanceTo(expected)).toBeLessThan(1e-5);
}
