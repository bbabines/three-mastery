import * as THREE from 'three';
import { expect } from 'vitest';
import type { clearMarked } from './drill';

export function checkSafeMutation(subject: typeof clearMarked): void {
  const root=new THREE.Group(), originals:THREE.Material[]=[], targets:THREE.Mesh[]=[], helpers:THREE.Object3D[]=[];
  for(let i=0;i<6;i++){
    const original=new THREE.MeshBasicMaterial(), target=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({color:0xff00ff}));
    target.userData.originalMaterial=original; const helper=new THREE.Object3D(); helper.userData.highlightHelper=true; helper.userData.target=target;
    root.add(target); helpers.push(helper); originals.push(original); targets.push(target);
  }
  helpers.forEach(helper=>root.add(helper));
  expect(subject(root)).toBe(6); expect(root.children).toHaveLength(6);
  targets.forEach((target,i)=>expect(target.material).toBe(originals[i]));
}
