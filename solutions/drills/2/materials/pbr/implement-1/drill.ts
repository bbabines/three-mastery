import type { Answer } from '@harness/drill';
import { MeshStandardMaterial } from 'three';
export function chromeFinish(material: MeshStandardMaterial): Answer<MeshStandardMaterial> {
  material.metalness = 1;
  material.roughness = .08;
  material.color.set('#eeeeee');
  return material;
}
