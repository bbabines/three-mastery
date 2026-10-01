import type { Answer } from '@harness/drill';
import { Color } from 'three';

// Combine linear-light colors. Alpha replaces a fraction of the background; additive adds a
// fraction of the source. Preserve both inputs; do not clamp additive light at 1.
export function composite(background: Color, source: Color, opacity: number, mode: 'alpha' | 'additive'): Answer<Color> {
  return null;
}
