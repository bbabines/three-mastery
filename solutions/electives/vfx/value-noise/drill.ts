import type { Answer } from '@harness/drill';
import { mx_noise_float, smoothstep } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function cloudMask(uv: Node<'vec2'>, scale: Node<'float'>, cutoff: Node<'float'>): Answer<Node<'float'>> {
  const field = mx_noise_float(uv.mul(scale)).mul(0.5).add(0.5);
  return smoothstep(cutoff.sub(0.08), cutoff.add(0.08), field);
}
