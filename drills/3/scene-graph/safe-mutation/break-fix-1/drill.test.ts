import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { clearMarked } from './drill';

describe('scene-graph.safe-mutation', () => {
  it('repairs the reported symptom for a general case', () => {
    const root=new THREE.Group(), originals:THREE.Material[]=[], targets:THREE.Mesh[]=[], helpers:THREE.Object3D[]=[];
    for(let i=0;i<5;i++){
      const original=new THREE.MeshBasicMaterial(), target=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({color:0xffff00}));
      target.userData.originalMaterial=original; const helper=new THREE.Object3D(); helper.userData.highlightHelper=true; helper.userData.target=target;
      root.add(target); helpers.push(helper); originals.push(original); targets.push(target);
    }
    helpers.forEach(helper=>root.add(helper));
    expect(clearMarked(root)).toBe(5); expect(root.children).toHaveLength(5);
    targets.forEach((target,i)=>expect(target.material).toBe(originals[i]));
  });
});
