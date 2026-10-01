// No docs: solve every part once, then run npm run pick -- done.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// object types tour: answer from memory.
export function checkObjectTypesTour(geometry: THREE.BufferGeometry, material: THREE.Material, count: number): Answer<THREE.InstancedMesh> {
  return null;
}

// buffer attribute: answer from memory.
export function checkBufferAttribute(position: THREE.BufferAttribute, index: number): Answer<THREE.Vector3> {
  return null;
}

// interleaved: answer from memory.
export function checkInterleaved(position: THREE.InterleavedBufferAttribute, index: number, newPosition: THREE.Vector3): Answer<boolean> {
  return null;
}

// indexed: answer from memory.
export function checkIndexed(geometry: THREE.BufferGeometry, triangleIndex: number): Answer<[THREE.Vector3, THREE.Vector3, THREE.Vector3]> {
  return null;
}

// winding order: answer from memory.
export function checkWindingOrder(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, viewDirection: THREE.Vector3): Answer<boolean> {
  return null;
}

// face normals: answer from memory.
export function checkFaceNormals(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, modelToWorld: THREE.Matrix4): Answer<THREE.Vector3> {
  return null;
}

// vertex normals: answer from memory.
export function checkVertexNormals(geometry: THREE.BufferGeometry): Answer<THREE.BufferGeometry> {
  return null;
}

// uvs: answer from memory.
export function checkUvs(geometry: THREE.BufferGeometry, uv: THREE.Vector2): Answer<THREE.BufferGeometry> {
  return null;
}

// bounding volumes: answer from memory.
export function checkBoundingVolumes(geometry: THREE.BufferGeometry): Answer<THREE.Sphere> {
  return null;
}

// updating buffers: answer from memory.
export function checkUpdatingBuffers(attribute: THREE.BufferAttribute, index: number, value: THREE.Vector3): Answer<number> {
  return null;
}

// groups: answer from memory.
export function checkGroups(geometry: THREE.BufferGeometry, start: number, count: number, slot: number): Answer<number> {
  return null;
}

// instanced mesh: answer from memory.
export function checkInstancedMesh(mesh: THREE.InstancedMesh, index: number, position: THREE.Vector3): Answer<boolean> {
  return null;
}

// tangent space: answer from memory.
export function checkTangentSpace(sample: THREE.Vector3, tangent: THREE.Vector3, bitangent: THREE.Vector3, normal: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
