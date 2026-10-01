import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { undoTransform } from './drill';

describe('transforms.inverse-matrices', () => {
  it('undo a saved model-to-world transform so a world hit becomes a local point, preserving the saved matrix', () => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(4,-2,1), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,1,0).normalize(),0.5), new THREE.Vector3(2,1,3));
    const before = m.clone(), local = new THREE.Vector3(0.2,3,-1), world = local.clone().applyMatrix4(m);
    expect(answered(undoTransform(world,m)).distanceTo(local)).toBeLessThan(1e-6);
    expect(m.equals(before)).toBe(true);
  });
});
