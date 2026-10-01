import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, smoke);

export function smoke(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  return null;
}
