import type { Answer } from '@harness/drill';
import { installDissolve, type EffectSetup } from '@harness/vfx-effects';
import { abs, color, mx_noise_float, oneMinus, smoothstep, uv } from 'three/tsl';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installDissolve(viewer, dissolveMaterial);

export function dissolveMaterial(progress: Node<'float'>): Answer<THREE.Material> {
  const noise = mx_noise_float(uv().mul(9)).mul(0.5).add(0.5);
  const remaining = smoothstep(progress.sub(0.08), progress.add(0.08), noise);
  const edge = oneMinus(smoothstep(0, 0.06, abs(noise.sub(progress))));
  const material = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
  material.colorNode = color(0x5aa9d9).mul(remaining).add(color(0xff8a32).mul(edge));
  material.opacityNode = remaining.add(edge).clamp(0, 1);
  return material;
}
