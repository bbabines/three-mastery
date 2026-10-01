import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, shield);

export function shield(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  // 1. Fit a shell outside the selected part's world bounds.
  // 2. Scroll cellular coordinates over its UVs to make moving veins.
  // 3. Fade the shell where it meets opaque scene depth.
  return null;
}
