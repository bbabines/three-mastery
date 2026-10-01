import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function meshCount(root: THREE.Object3D): Answer<number> {
  let count=0; root.traverse(object=>{if(object instanceof THREE.Mesh)count++;}); return count;
}

export function findNamed(root: THREE.Object3D, name: string): Answer<THREE.Object3D | undefined> {
  return root.getObjectByName(name);
}

export function removeNamed(root: THREE.Object3D, name: string): Answer<number> {
  const matches:THREE.Object3D[]=[]; root.traverse(o=>{if(o.name===name)matches.push(o);}); for(const o of matches)o.removeFromParent(); return matches.length;
}

export function worldBox(root: THREE.Object3D): Answer<THREE.Box3> {
  root.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(root,true);
}

export function triangleCount(root: THREE.Object3D): Answer<number> {
  let count=0; root.traverse(o=>{if(o instanceof THREE.Mesh){const g=o.geometry as THREE.BufferGeometry; count+=(g.index?.count??g.getAttribute('position')?.count??0)/3;}}); return count;
}

export function makePickLayer(object: THREE.Object3D, layer: number): Answer<number> {
  object.layers.set(layer); return object.layers.mask;
}

export function tagPart(object: THREE.Object3D, id: string): Answer<string> {
  object.userData.partId=id; return object.userData.partId as string;
}

export function overrideMaterial(mesh: THREE.Mesh, replacement: THREE.Material): Answer<THREE.Material | THREE.Material[]> {
  const original=mesh.material; mesh.material=replacement; return original;
}

export function duplicateTree(root: THREE.Object3D): Answer<THREE.Object3D> {
  return root.clone(true);
}
