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

// ---- For drill functions that take and return three.js vectors (docs/writing-drills.md) ----

type XYZ = { x: number; y: number; z: number };

// Fails with "not answered yet" while a drill function still returns null, and otherwise hands back
// its answer, for checks the helpers above don't cover: booleans, labels, and objects of answers.
export function answered<T>(actual: Answer<T>): T {
  expect(actual, 'not answered yet').not.toBeNull();
  return actual as T;
}

// An answer that's a Vector3 (or anything with x, y, and z): each part must match at 3 decimal
// places. `name` labels the parts in the failure message, like "right.x".
export function expectVector(actual: Answer<XYZ>, expected: XYZ, name = 'answer') {
  expect(actual, 'not answered yet').not.toBeNull();
  const { x, y, z } = actual as XYZ;
  expect(x, `${name}.x`).toBeCloseTo(expected.x, DECIMALS);
  expect(y, `${name}.y`).toBeCloseTo(expected.y, DECIMALS);
  expect(z, `${name}.z`).toBeCloseTo(expected.z, DECIMALS);
}

// Fails if a drill function changed a vector it was handed. sub, add, cross, normalize, lerp,
// multiplyScalar, projectOnVector, and reflect all change the vector they're called on, so a
// function has to clone before using them on its inputs. `before` is a copy taken before the call.
export function expectUnchanged(vector: XYZ, before: XYZ, name: string) {
  expect([vector.x, vector.y, vector.z], `${name} was changed: clone it before calling a method that changes it`).toEqual([
    before.x,
    before.y,
    before.z,
  ]);
}
