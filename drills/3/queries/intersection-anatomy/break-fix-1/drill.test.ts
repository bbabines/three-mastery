import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { hitNormalWorld } from './drill';

describe('queries.intersection-anatomy', () => {
  it('repairs the reported symptom for a general case', () => {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry()); mesh.scale.set(3,1,0.5); mesh.rotation.y=0.6; const local=new THREE.Vector3(1,1,1).normalize();
    const got=hitNormalWorld({object:mesh,face:{normal:local}}); mesh.updateMatrixWorld();
    const expected=local.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)).normalize(); expect(got.distanceTo(expected)).toBeLessThan(1e-6);
  });
});
