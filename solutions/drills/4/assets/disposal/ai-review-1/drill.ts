import { MeshStandardMaterial } from 'three';
export function retireMaterial(oldMaterial: MeshStandardMaterial, nextMaterial: MeshStandardMaterial): void {
  for (const texture of new Set([oldMaterial.map, oldMaterial.roughnessMap])) {
    if (texture && texture !== nextMaterial.map && texture !== nextMaterial.roughnessMap) texture.dispose();
  }
  oldMaterial.dispose();
}
