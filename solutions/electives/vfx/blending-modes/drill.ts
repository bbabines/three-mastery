import type { Answer } from '@harness/drill';
import { Color } from 'three';

export function composite(background: Color, source: Color, opacity: number, mode: 'alpha' | 'additive'): Answer<Color> {
  const result = background.clone();
  if (mode === 'alpha') result.multiplyScalar(1 - opacity);
  return result.add(source.clone().multiplyScalar(opacity));
}
