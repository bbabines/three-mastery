import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { instanceHardware } from './drill';

describe('instanceHardware', () => {
it('stores every transform but shares one geometry and material', () => {
    const geometry=new THREE.BoxGeometry(), material=new THREE.MeshBasicMaterial();
    const placements=[new THREE.Matrix4().makeTranslation(1,0,0),new THREE.Matrix4().makeTranslation(2,0,0),new THREE.Matrix4().makeTranslation(3,0,0)];
    const mesh=answered(instanceHardware(geometry,material,placements)); expect(mesh.count).toBe(3);
    expect(mesh.geometry).toBe(geometry); expect(mesh.material).toBe(material);
    for(let i=0;i<3;i++){const got=new THREE.Matrix4(); mesh.getMatrixAt(i,got); expect(got.elements).toEqual(placements[i].elements);}
    geometry.dispose(); material.dispose();
  });
});
