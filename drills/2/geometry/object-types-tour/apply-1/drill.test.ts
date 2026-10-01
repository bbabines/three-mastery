import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { makeRepeatedParts } from './drill';

describe('geometry.object-types-tour', () => {
  it('build one instancedmesh for repeated parts that share geometry and material, setting each instance a different pose', () => {
    const geometry=new THREE.BoxGeometry(), material=new THREE.MeshBasicMaterial(); const mesh=answered(makeRepeatedParts(geometry,material,5));
    expect(mesh.count).toBe(5); expect(mesh.geometry).toBe(geometry); expect(mesh.material).toBe(material);
    const matrix=new THREE.Matrix4(); mesh.getMatrixAt(4,matrix); expect(new THREE.Vector3().setFromMatrixPosition(matrix).x).toBe(4);
  });
});
