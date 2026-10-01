import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import { softParticleOpacity } from '../../../../../../electives/vfx/shared';
import { abs, color, fract, mx_worley_noise_float_2d, oneMinus, smoothstep, time, uniform, uv, vec2 } from 'three/tsl';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, shield);

export function shield(part: THREE.Object3D, _camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  const bounds = new THREE.Box3().setFromObject(part);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const p = uv().mul(8).add(vec2(fract(time.mul(0.08)), 0));
  const distance = mx_worley_noise_float_2d(p);
  const veins = oneMinus(smoothstep(0.02, 0.1, abs(distance.sub(0.32))));
  const material = new THREE.MeshBasicNodeMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  material.colorNode = color(0x4db8ff).mul(veins.mul(0.85).add(0.2));
  material.opacityNode = softParticleOpacity(veins.mul(0.65).add(0.22), uniform(0.25));
  const shell = new THREE.Mesh(new THREE.BoxGeometry(
    Math.max(0.18, size.x + 0.12), Math.max(0.18, size.y + 0.12), Math.max(0.18, size.z + 0.12),
  ), material);
  shell.position.copy(center);
  return { object: shell };
}
