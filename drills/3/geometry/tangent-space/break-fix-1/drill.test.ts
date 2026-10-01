import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { normalFromMap } from './drill';

describe('geometry.tangent-space', () => {
  it('repairs the reported symptom for a general case', () => {
    const t=new THREE.Vector3(0,0,-1), b=new THREE.Vector3(0,1,0), n=new THREE.Vector3(1,0,0), sample=new THREE.Vector3(0.75,0.25,1);
    const before = [sample.clone(), t.clone(), b.clone(), n.clone()];
    const got=normalFromMap(sample,t,b,n); const expected=t.clone().multiplyScalar(0.5).addScaledVector(b,-0.5).addScaledVector(n,1).normalize();
    expect(got.distanceTo(expected)).toBeLessThan(1e-6);
    expect(normalFromMap(new THREE.Vector3(0.5,0.5,1),t,b,n).distanceTo(n)).toBeLessThan(1e-6);
    expect([sample, t, b, n]).toEqual(before);
  });
});
