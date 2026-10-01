import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { segmentSnap } from './drill';

describe('queries.closest-point', () => {
  it('repairs the reported symptom for a general case', () => {
    const a=new THREE.Vector3(0,0,0),b=new THREE.Vector3(2,0,0); expect(segmentSnap(new THREE.Vector3(5,1,0),a,b).distanceTo(b)).toBeLessThan(1e-6);
    expect(segmentSnap(new THREE.Vector3(1,1,0),a,b).distanceTo(new THREE.Vector3(1,0,0))).toBeLessThan(1e-6);
  });
});
