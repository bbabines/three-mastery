// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// object-types-tour: Choose a surface object for geometry and material.
export function surfaceObject(geometry: THREE.BufferGeometry, material: THREE.Material): Answer<THREE.Mesh> {
  return null;
}

// buffer-attribute: Read one XYZ vertex by item index.
export function vertexAt(attribute: THREE.BufferAttribute, index: number): Answer<THREE.Vector3> {
  return null;
}

// interleaved: Read the number of stored values per interleaved vertex.
export function interleavedStride(attribute: THREE.InterleavedBufferAttribute): Answer<number> {
  return null;
}

// indexed: Read the three vertex IDs of an indexed triangle.
export function triangleIndices(geometry: THREE.BufferGeometry, triangle: number): Answer<number[]> {
  return null;
}

// winding-order: Find the side a triangle faces from its corner order.
export function frontNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// face-normals: Get the flat face normal from three.js.
export function faceNormal(triangle: THREE.Triangle): Answer<THREE.Vector3> {
  return null;
}

// vertex-normals: Recompute vertex normals after moving vertices.
export function rebuildNormals(geometry: THREE.BufferGeometry): Answer<THREE.BufferAttribute> {
  return null;
}

// uvs: Read a vertex's UV coordinates.
export function uvAt(geometry: THREE.BufferGeometry, vertex: number): Answer<THREE.Vector2> {
  return null;
}

// bounding-volumes: Compute local geometry bounds after a vertex edit.
export function localBounds(geometry: THREE.BufferGeometry): Answer<THREE.Box3> {
  return null;
}

// updating-buffers: Write one vertex and mark its buffer for upload.
export function updateVertex(attribute: THREE.BufferAttribute, index: number, point: THREE.Vector3): Answer<number> {
  return null;
}

// groups: Assign a draw range to one material.
export function addMaterialGroup(geometry: THREE.BufferGeometry, start: number, count: number, materialIndex: number): Answer<number> {
  return null;
}

// instanced-mesh: Update one instance transform for the next render.
export function setInstanceTransform(mesh: THREE.InstancedMesh, index: number, matrix: THREE.Matrix4): Answer<number> {
  return null;
}

// tangent-space: Find the third direction of a tangent basis.
export function bitangent(normal: THREE.Vector3, tangent: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}
