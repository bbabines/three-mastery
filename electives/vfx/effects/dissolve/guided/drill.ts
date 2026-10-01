import type { Answer } from '@harness/drill';
import { installDissolve, type EffectSetup } from '@harness/vfx-effects';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';

// The viewer handles selection and restores each part's original shared material. Supply only a
// temporary material driven by progress (0 visible, 1 gone).
export const effect: EffectSetup = (viewer) => installDissolve(viewer, dissolveMaterial);

export function dissolveMaterial(progress: Node<'float'>): Answer<THREE.Material> {
  // 1. Sample smooth noise at the part's UVs.
  // 2. Compare the field with progress to hide more pixels over time.
  // 3. Color a thin band at the moving edge; keep the rest transparent.
  return null;
}
