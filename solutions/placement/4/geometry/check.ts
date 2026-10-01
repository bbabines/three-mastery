import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function surfaceObject(geometry: THREE.BufferGeometry, material: THREE.Material): Answer<THREE.Mesh> {
  return new THREE.Mesh(geometry,material);
}

export function vertexAt(attribute: THREE.BufferAttribute, index: number): Answer<THREE.Vector3> {
  return new THREE.Vector3(attribute.getX(index),attribute.getY(index),attribute.getZ(index));
}

export function interleavedStride(attribute: THREE.InterleavedBufferAttribute): Answer<number> {
  return attribute.data.stride;
}

export function triangleIndices(geometry: THREE.BufferGeometry, triangle: number): Answer<number[]> {
  const index=geometry.getIndex()!; return [index.getX(triangle*3),index.getX(triangle*3+1),index.getX(triangle*3+2)];
}

export function frontNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3> {
  return new THREE.Triangle(a,b,c).getNormal(new THREE.Vector3());
}

export function faceNormal(triangle: THREE.Triangle): Answer<THREE.Vector3> {
  return triangle.getNormal(new THREE.Vector3());
}

export function rebuildNormals(geometry: THREE.BufferGeometry): Answer<THREE.BufferAttribute> {
  geometry.computeVertexNormals(); return geometry.getAttribute('normal') as THREE.BufferAttribute;
}

export function uvAt(geometry: THREE.BufferGeometry, vertex: number): Answer<THREE.Vector2> {
  const uv=geometry.getAttribute('uv'); return new THREE.Vector2(uv.getX(vertex),uv.getY(vertex));
}

export function localBounds(geometry: THREE.BufferGeometry): Answer<THREE.Box3> {
  geometry.computeBoundingBox(); return geometry.boundingBox!.clone();
}

export function updateVertex(attribute: THREE.BufferAttribute, index: number, point: THREE.Vector3): Answer<number> {
  attribute.setXYZ(index,point.x,point.y,point.z); attribute.needsUpdate=true; return attribute.version;
}

export function addMaterialGroup(geometry: THREE.BufferGeometry, start: number, count: number, materialIndex: number): Answer<number> {
  geometry.addGroup(start,count,materialIndex); return geometry.groups.length;
}

export function setInstanceTransform(mesh: THREE.InstancedMesh, index: number, matrix: THREE.Matrix4): Answer<number> {
  mesh.setMatrixAt(index,matrix); mesh.instanceMatrix.needsUpdate=true; return mesh.instanceMatrix.version;
}

export function bitangent(normal: THREE.Vector3, tangent: THREE.Vector3): Answer<THREE.Vector3> {
  return new THREE.Vector3().crossVectors(normal,tangent).normalize();
}
