import * as THREE from 'three';
import { expect } from 'vitest';
import type { nextEmphasis } from './drill';

export function checkHoverSelection(subject: typeof nextEmphasis): void {
  const selected=subject(false,true,1,0.2); expect(selected).toBeGreaterThan(1.1);
  const one=subject(true,false,1,0.08), two=subject(true,false,subject(true,false,1,0.04),0.04); expect(one).toBeCloseTo(two,6);
}
