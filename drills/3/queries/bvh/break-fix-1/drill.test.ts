import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { candidateLeaves } from './drill';

describe('queries.bvh', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), near=new THREE.Group(), far=new THREE.Group(), hit=new THREE.Object3D(), miss=new THREE.Object3D();
    root.userData.box=new THREE.Box3(new THREE.Vector3(-4,-1,-5),new THREE.Vector3(4,1,1)); near.userData.box=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1)); far.userData.box=new THREE.Box3(new THREE.Vector3(3,-1,-5),new THREE.Vector3(4,1,-3)); hit.userData.box=near.userData.box.clone(); miss.userData.box=far.userData.box.clone(); near.add(hit); far.add(miss); root.add(near,far);
    const ray=new THREE.Ray(new THREE.Vector3(0,0,5),new THREE.Vector3(0,0,-1)); expect(candidateLeaves(ray,root)).toEqual([hit]);
  });
});
