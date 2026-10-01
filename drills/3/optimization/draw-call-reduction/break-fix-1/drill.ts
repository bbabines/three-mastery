import { BufferGeometry, InstancedMesh, Matrix4, MeshBasicMaterial } from 'three';
export function buildCutoutRack(geometry: BufferGeometry, material: MeshBasicMaterial, placements: Matrix4[]): InstancedMesh {
  material.transparent = true;
  material.depthWrite = false;
  material.alphaTest = 0;
  const rack = new InstancedMesh(geometry, material, placements.length);
  placements.forEach((matrix, index) => rack.setMatrixAt(index, matrix));
  rack.instanceMatrix.needsUpdate = true;
  return rack;
}
