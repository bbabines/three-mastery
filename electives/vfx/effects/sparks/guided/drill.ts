import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, sparks);

// Build a short burst centered on the selected part. Return its visible object and an update(dt)
// function; the viewer handles selection, mounting, and disposal.
export function sparks(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  // 1. Spawn a small fixed number of streak planes at the part's world center.
  // 2. Give each a velocity and lifetime.
  // 3. In update(dt), integrate gravity and turn each plane toward the camera and its velocity.
  return null;
}
