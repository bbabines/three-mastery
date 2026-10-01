import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { keepWorldOnAttach } from './drill';

describe('transforms.object3d-tour', () => {
  it('move a part into a new group with the object3d attach operation, keeping the part at the same world spot', () => {
    const a=new THREE.Group(), b=new THREE.Group(), part=new THREE.Object3D(); a.position.set(2,0,1); b.position.set(-3,1,0); a.add(part); part.position.set(1,2,0);
    const before=part.getWorldPosition(new THREE.Vector3()); const after=answered(keepWorldOnAttach(part,b));
    expect(part.parent).toBe(b); expect(after.distanceTo(before)).toBeLessThan(1e-6);
    expect(part.getWorldPosition(new THREE.Vector3()).distanceTo(before)).toBeLessThan(1e-6);
  });
});
