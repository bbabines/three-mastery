import type { Answer } from '@harness/drill';
import { MeshBasicMaterial } from 'three';

// Set this unlit material to a CSS picker color and keep it out of tone mapping.
export function matchPicker(material: MeshBasicMaterial, cssColor: string): Answer<MeshBasicMaterial> {
  return null;
}
