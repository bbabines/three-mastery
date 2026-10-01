import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { selectableBoxHit } from './drill';

describe('queries.filtering', () => {
  it('repairs the reported symptom for a general case', () => {
    const ray=new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,-1));
    const helper=new THREE.Object3D(),part=new THREE.Object3D(); helper.userData.bounds=new THREE.Box3(new THREE.Vector3(-1,-1,2),new THREE.Vector3(1,1,3)); part.userData.bounds=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,0)); part.userData.selectable=true;
    const farther=new THREE.Object3D(); farther.userData.selectable=true;
    farther.userData.bounds=new THREE.Box3(new THREE.Vector3(-1,-1,-3),new THREE.Vector3(1,1,-2));
    expect(selectableBoxHit(ray,[helper,farther,part])).toBe(part);
    expect(selectableBoxHit(ray,[helper])).toBeNull();
  });
});
