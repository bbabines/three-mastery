import type { Answer } from '@harness/drill';
import { MeshBasicMaterial } from 'three';

export function matchPicker(material: MeshBasicMaterial, cssColor: string): Answer<MeshBasicMaterial> {
  material.color.setStyle(cssColor);
  material.toneMapped = false;
  return material;
}
