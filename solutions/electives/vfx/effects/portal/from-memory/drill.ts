import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import { curlNoise } from 'three/addons/tsl/math/curlNoise.js';
import { atan, color, length, oneMinus, sin, smoothstep, time, uv, vec3 } from 'three/tsl';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, portal);

export function portal(part: THREE.Object3D, _camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  const bounds = new THREE.Box3().setFromObject(part);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const flow = curlNoise(vec3(uv().mul(3), time.mul(0.12))).xy;
  const p = uv().sub(0.5).add(flow.mul(0.06));
  const radius = length(p);
  const spiral = sin(atan(p.y, p.x).mul(6).sub(radius.mul(18)).add(time.mul(1.5))).mul(0.5).add(0.5);
  const disc = smoothstep(0.07, 0.13, radius).mul(oneMinus(smoothstep(0.38, 0.48, radius)));
  const energy = disc.mul(spiral.mul(0.75).add(0.25));
  const material = new THREE.MeshBasicNodeMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  material.colorNode = color(0x9258ff).mul(energy);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), material);
  plane.position.set(center.x, 0.025, center.z);
  plane.scale.setScalar(Math.max(1.2, Math.max(size.x, size.z) * 1.6));
  return { object: plane };
}
