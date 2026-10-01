import type { Object3D, Vector3 } from 'three';

type Anchor = (part: Object3D, newPosition: Vector3, anchorLocal: Vector3) => Vector3;

export function checkAnchor(_movedAnchor: Anchor): void {
  throw new Error('Write the regression check in check.ts');
}
