import type { Answer } from '@harness/drill';
import { abs, fract, oneMinus, smoothstep } from 'three/tsl';
import type { Node } from 'three/webgpu';

export function flowBands(uv: Node<'vec2'>, time: Node<'float'>, speed: Node<'float'>): Answer<Node<'float'>> {
  const phase = fract(uv.x.mul(4).add(fract(time.mul(speed))));
  return oneMinus(smoothstep(0.2, 0.3, abs(phase.sub(0.5))));
}
