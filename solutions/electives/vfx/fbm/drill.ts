import type { Answer } from '@harness/drill';
import { mx_noise_float, smoothstep } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function layeredMask(uv: Node<'vec2'>, scale: Node<'float'>, cutoff: Node<'float'>): Answer<Node<'float'>> {
  const p = uv.mul(scale);
  const field = mx_noise_float(p)
    .add(mx_noise_float(p.mul(2)).mul(0.5))
    .add(mx_noise_float(p.mul(4)).mul(0.25))
    .div(1.75).mul(0.5).add(0.5);
  return smoothstep(cutoff.sub(0.08), cutoff.add(0.08), field);
}
