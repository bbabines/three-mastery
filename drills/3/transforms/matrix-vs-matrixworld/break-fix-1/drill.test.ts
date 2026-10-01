import { expectVector } from '@harness/check';
import { Object3D, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { moveWithoutJump } from './drill';

function setup() {
  const oldParent = new Object3D();
  oldParent.position.set(-2, 1, 0);
  oldParent.rotation.y = 0.4;
  const newParent = new Object3D();
  newParent.position.set(3, -1, 2);
  newParent.rotation.set(0.2, -0.6, 0.1);
  const part = new Object3D();
  part.position.set(0.8, 0.2, -0.3);
  part.rotation.z = 0.3;
  oldParent.add(part);
  return { oldParent, newParent, part };
}

describe('moveWithoutJump', () => {
  it('keeps world position and orientation while changing parent', () => {
    const { part, newParent } = setup();
    const beforePosition = part.getWorldPosition(new Vector3());
    const beforeRotation = part.getWorldQuaternion(new Quaternion());
    expectVector(moveWithoutJump(part, newParent), beforePosition);
    expect(part.parent).toBe(newParent);
    expect(part.getWorldQuaternion(new Quaternion()).angleTo(beforeRotation)).toBeLessThan(1e-5);
  });

  it('works when the new parent is translated and turned again', () => {
    const { part, newParent } = setup();
    newParent.position.set(-4, 3, -2);
    newParent.rotation.set(-0.3, 0.8, 0.2);
    const before = part.getWorldPosition(new Vector3());
    expectVector(moveWithoutJump(part, newParent), before);
  });
});
