import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, portal);

export function portal(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  // 1. Put a flat plane just above the floor at the part's world-space footprint.
  // 2. Use curl noise to move UVs before evaluating a circular spiral mask.
  // 3. Make the energy additive and keep depth writes off.
  return null;
}
