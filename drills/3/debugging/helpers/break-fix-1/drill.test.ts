import { Object3D, Quaternion, Vector3 } from 'three';
import { expectUnchanged, expectVector } from '@harness/check';
import { describe, it } from 'vitest';
import { worldArrow } from './drill';

describe('worldArrow', () => {
  it('draws the world ray under a translated and rotated parent', () => {
    const parent = new Object3D(); parent.position.set(3, 1, -2); parent.rotation.set(0.2, 0.7, 0);
    const origin = new Vector3(-1, 2, 0.5); const direction = new Vector3(1, -0.3, 2);
    const beforeOrigin = origin.clone(); const beforeDirection = direction.clone();
    const arrow = worldArrow(parent, origin, direction);
    parent.updateMatrixWorld(true);
    expectVector(arrow.getWorldPosition(new Vector3()), origin, 'ray origin');
    expectVector(new Vector3(0, 1, 0).applyQuaternion(arrow.getWorldQuaternion(new Quaternion())).normalize(), direction.clone().normalize(), 'ray direction');
    expectUnchanged(origin, beforeOrigin, 'origin'); expectUnchanged(direction, beforeDirection, 'direction');
  });
});
