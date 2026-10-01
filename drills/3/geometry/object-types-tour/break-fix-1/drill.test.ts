import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { placeInstance } from './drill';

describe('geometry.object-types-tour', () => {
  it('repairs the reported symptom for a general case', () => {
    const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial(),4);
    const pose=new THREE.Matrix4().makeTranslation(3,1,0); expect(placeInstance(mesh,2,pose)).toBe(true);
    const got=new THREE.Matrix4(); mesh.getMatrixAt(2,got);
    expect(new THREE.Vector3().setFromMatrixPosition(got).distanceTo(new THREE.Vector3(3,1,0))).toBeLessThan(1e-6);
    expect(mesh.position.length()).toBe(0);
  });
});
