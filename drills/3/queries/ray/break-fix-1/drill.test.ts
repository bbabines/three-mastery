import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { sphereEntry } from './drill';

describe('queries.ray', () => {
  it('repairs the reported symptom for a general case', () => {
    const sphere=new THREE.Sphere(new THREE.Vector3(0,0,0),2);
    const outside=new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,-1)); expect(sphereEntry(outside,sphere)!.distanceTo(new THREE.Vector3(0,0,2))).toBeLessThan(1e-6);
    const inside=new THREE.Ray(new THREE.Vector3(),new THREE.Vector3(1,0,0)); expect(sphereEntry(inside,sphere)!.distanceTo(new THREE.Vector3(2,0,0))).toBeLessThan(1e-6);
    const miss=new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,1,0)); expect(sphereEntry(miss,sphere)).toBeNull();
  });
});
