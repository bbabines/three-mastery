import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { rotatedBoxHit } from './drill';

describe('queries.ray-aabb', () => {
  it('repairs the reported symptom for a general case', () => {
    const box=new THREE.Box3(new THREE.Vector3(-1,-1,-0.2),new THREE.Vector3(1,1,0.2)); const matrix=new THREE.Matrix4().compose(new THREE.Vector3(3,0,0),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.8),new THREE.Vector3(1,1,1));
    const ray=new THREE.Ray(new THREE.Vector3(3,0,5),new THREE.Vector3(0,0,-1)); const matrixBefore=matrix.clone(), originBefore=ray.origin.clone(); const got=rotatedBoxHit(ray,box,matrix);
    const local=ray.clone().applyMatrix4(matrix.clone().invert()).intersectBox(box,new THREE.Vector3()); expect(got!.distanceTo(local!.applyMatrix4(matrix))).toBeLessThan(1e-6);
    expect(matrix.equals(matrixBefore)&&ray.origin.equals(originBefore)).toBe(true);
    expect(rotatedBoxHit(new THREE.Ray(new THREE.Vector3(-3,0,5),new THREE.Vector3(0,0,-1)),box,matrix)).toBeNull();
  });
});
