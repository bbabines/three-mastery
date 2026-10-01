import * as THREE from 'three';
import { expect } from 'vitest';
import type { hitNormalWorld } from './drill';

export function checkIntersectionAnatomy(subject: typeof hitNormalWorld): void {
  const mesh=new THREE.Mesh(new THREE.BoxGeometry()); mesh.scale.set(0.5,4,2); mesh.rotation.x=0.5; const local=new THREE.Vector3(1,1,1).normalize(); mesh.updateMatrixWorld();
  const got=subject({object:mesh,face:{normal:local}}), expected=local.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)).normalize();
  expect(got.angleTo(expected)).toBeLessThan(1e-6);
}
