import * as THREE from 'three';
import { expect } from 'vitest';
import type { headroomMs } from './drill';

export function checkFrameBudget(subject: typeof headroomMs): void {
  expect(subject(7,8,60)).toBeCloseTo(1000/60-8,6); expect(subject(8,7,120)).toBeCloseTo(1000/120-8,6);
}
