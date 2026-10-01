import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function makeHierarchy(parent: THREE.Object3D, child: THREE.Object3D): Answer<THREE.Object3D> {
  return parent.add(child);
}

export function worldPoint(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return object.localToWorld(local.clone());
}

export function worldTranslation(object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
}

export function movedWorldPoint(object: THREE.Object3D, nextLocal: THREE.Vector3): Answer<THREE.Vector3> {
  object.position.copy(nextLocal); object.updateWorldMatrix(true,false); return object.getWorldPosition(new THREE.Vector3());
}

export function pointAfterTrs(point: THREE.Vector3, position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3): Answer<THREE.Vector3> {
  return point.clone().applyMatrix4(new THREE.Matrix4().compose(position,rotation,scale));
}

export function translationOf(matrix: THREE.Matrix4): Answer<THREE.Vector3> {
  const p=new THREE.Vector3(); matrix.decompose(p,new THREE.Quaternion(),new THREE.Vector3()); return p;
}

export function worldDirection(object: THREE.Object3D, local: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return local.clone().transformDirection(object.matrixWorld);
}

export function localPoint(object: THREE.Object3D, world: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return object.worldToLocal(world.clone());
}

export function keepWorldOnReparent(child: THREE.Object3D, newParent: THREE.Object3D): Answer<THREE.Object3D> {
  newParent.attach(child); return child;
}

export function pivotedOrigin(object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return new THREE.Vector3().applyMatrix4(object.matrixWorld);
}

export function normalInWorld(object: THREE.Object3D, normal: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(object.matrixWorld)).normalize();
}

export function reversesHandedness(world: THREE.Matrix4): Answer<boolean> {
  return world.determinant()<0;
}
