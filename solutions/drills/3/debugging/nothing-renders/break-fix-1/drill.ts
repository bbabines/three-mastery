import type { Mesh } from 'three';

export function canAppear(mesh: Mesh): boolean {
  if (mesh.parent === null || !mesh.visible) return false;
  mesh.updateWorldMatrix(true, false);
  return Number.isFinite(mesh.matrixWorld.determinant()) && Math.abs(mesh.matrixWorld.determinant()) > 1e-12;
}
