import type { Answer } from '@harness/drill';
import { MeshStandardMaterial } from 'three';
export function brushedSteel(material: MeshStandardMaterial, color: string): Answer<MeshStandardMaterial> {
  material.metalness = 1;
  material.roughness = .55;
  material.color.setStyle(color);
  return material;
}
