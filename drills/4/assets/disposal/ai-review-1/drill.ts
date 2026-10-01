import { MeshStandardMaterial } from 'three';
export function retireMaterial(oldMaterial: MeshStandardMaterial, nextMaterial: MeshStandardMaterial): void {
  oldMaterial.map?.dispose();
  oldMaterial.roughnessMap?.dispose();
  oldMaterial.dispose();
}
