import * as THREE from 'three';
import { expect } from 'vitest';
import type { smoothMove } from './drill';

export function checkFrameRateIndependence(subject: typeof smoothMove): void {
  const one=subject(3,17,5,0.2), two=subject(subject(3,17,5,0.08),17,5,0.12);
  expect(one).toBeCloseTo(two,6);
}
