import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { planeHit } from './drill';

describe('queries.ray-plane', () => {
  it('repairs the reported symptom for a general case', () => {
    const floor=new THREE.Plane(new THREE.Vector3(0,1,0),0), down=new THREE.Ray(new THREE.Vector3(1,3,2),new THREE.Vector3(0,-1,0));
    expect(planeHit(down,floor)!.distanceTo(new THREE.Vector3(1,0,2))).toBeLessThan(1e-6);
    expect(planeHit(new THREE.Ray(new THREE.Vector3(1,3,2),new THREE.Vector3(0,1,0)),floor)).toBeNull();
    expect(planeHit(new THREE.Ray(new THREE.Vector3(1,3,2),new THREE.Vector3(1,0,0)),floor)).toBeNull();
  });
});
