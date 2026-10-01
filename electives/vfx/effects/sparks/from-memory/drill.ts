import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, sparks);

// Return a burst object and its update(dt) function. The viewer handles selection and disposal.
export function sparks(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  return null;
}
