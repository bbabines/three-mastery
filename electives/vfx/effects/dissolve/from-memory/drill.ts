import type { Answer } from '@harness/drill';
import { installDissolve, type EffectSetup } from '@harness/vfx-effects';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';

// The viewer restores the selected part's original material when selection changes.
export const effect: EffectSetup = (viewer) => installDissolve(viewer, dissolveMaterial);

export function dissolveMaterial(progress: Node<'float'>): Answer<THREE.Material> {
  return null;
}
