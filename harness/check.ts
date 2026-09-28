// Assertions shared by the acceptance tests of code drills (Loops 2–4).
import { expect } from 'vitest';
import type { Answer, Vec3 } from './drill';

// Numeric answers pass at 3 decimal places.
const DECIMALS = 3;

export function expectNumber(actual: Answer<number>, expected: number) {
  expect(actual, 'not answered yet').not.toBeNull();
  expect(actual).toBeCloseTo(expected, DECIMALS);
}

// For answers where the exact value is the point: float32 rounding, NaN, booleans, labels.
export function expectExact<T>(actual: Answer<T>, expected: T) {
  expect(actual, 'not answered yet').not.toBeNull();
  expect(actual).toBe(expected);
}

export function expectVec3(actual: Answer<Vec3>, expected: { x: number; y: number; z: number }) {
  expect(actual, 'not answered yet').not.toBeNull();
  const [x, y, z] = actual as Vec3;
  expect(x, 'x').toBeCloseTo(expected.x, DECIMALS);
  expect(y, 'y').toBeCloseTo(expected.y, DECIMALS);
  expect(z, 'z').toBeCloseTo(expected.z, DECIMALS);
}
