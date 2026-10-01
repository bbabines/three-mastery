import { BufferGeometry, InstancedMesh, Matrix4, MeshBasicMaterial } from 'three';
export function buildCutoutRack(geometry: BufferGeometry, material: MeshBasicMaterial, placements: Matrix4[]): InstancedMesh {
  material.transparent = false;
  material.depthWrite = true;
  material.alphaTest = 0.5;
  const rack = new InstancedMesh(geometry, material, placements.length);
  placements.forEach((matrix, index) => rack.setMatrixAt(index, matrix));
  rack.instanceMatrix.needsUpdate = true;
  return rack;
}
