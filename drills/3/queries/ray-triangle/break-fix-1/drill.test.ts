import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { uvAtHit } from './drill';

describe('queries.ray-triangle', () => {
  it('repairs the reported symptom for a general case', () => {
    const a=new THREE.Vector3(0,0,0),b=new THREE.Vector3(2,0,0),c=new THREE.Vector3(0,2,0);
    const ray=new THREE.Ray(new THREE.Vector3(0.5,0.5,2),new THREE.Vector3(0,0,-1)); const got=uvAtHit(ray,a,b,c,new THREE.Vector2(),new THREE.Vector2(1,0),new THREE.Vector2(0,1));
    expect(got!.distanceTo(new THREE.Vector2(0.25,0.25))).toBeLessThan(1e-6);
    const uva=new THREE.Vector2(0.2,0.4),uvb=new THREE.Vector2(0.8,0.4),uvc=new THREE.Vector2(0.2,0.9),before=uva.clone();
    const expected=uva.clone().multiplyScalar(0.5).addScaledVector(uvb,0.25).addScaledVector(uvc,0.25);
    expect(uvAtHit(ray,a,b,c,uva,uvb,uvc)!.distanceTo(expected)).toBeLessThan(1e-6);
    expect(uva.equals(before)).toBe(true);
    expect(uvAtHit(new THREE.Ray(new THREE.Vector3(3,3,2),new THREE.Vector3(0,0,-1)),a,b,c,uva,uvb,uvc)).toBeNull();
  });
});
