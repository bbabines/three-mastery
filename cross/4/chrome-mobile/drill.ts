import type { Answer } from '@harness/drill';
import { MeshStandardMaterial, Scene, Texture } from 'three';

export function prepareChrome(scene: Scene, material: MeshStandardMaterial, preferred: Texture, fallback: Texture, preferredSupported: boolean): Answer<'preferred' | 'fallback'> {
  return null;
}
