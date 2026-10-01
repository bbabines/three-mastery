import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, smoke);

export function smoke(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  // 1. Make an atlas with eight smoke frames and create a few transparent planes near the floor.
  // 2. Map each plane's UV into its current atlas cell.
  // 3. Fade opacity by age and by the gap to scene depth; keep depthWrite off.
  // 4. Face the planes toward the camera and advance frames in update(dt).
  return null;
}
