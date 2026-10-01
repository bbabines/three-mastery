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

// ---- For drill functions that take or return saved transforms (a Matrix4) ----

type Transform = { elements: ArrayLike<number> };

// Where a saved transform puts a spot, worked out from its elements, which are stored column by
// column. Only moves, turns, resizes, and skews: the fourth row a camera's lens uses is left out.
const placeSpot = ({ elements: e }: Transform, [x, y, z]: Vec3): Vec3 => [
  e[0] * x + e[4] * y + e[8] * z + e[12],
  e[1] * x + e[5] * y + e[9] * z + e[13],
  e[2] * x + e[6] * y + e[10] * z + e[14],
];

const PROBES: Vec3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// An answer that's a Matrix4, a saved transform: it must put (0, 0, 0) and the spots 1 along each
// axis where `expected` puts them, at 3 decimal places. Those four spots pin down every move, turn,
// resize, and skew the transform holds, and a failure names the spot that landed in the wrong place.
export function expectTransform(actual: Answer<Transform>, expected: Transform, name = 'matrix') {
  expect(actual, 'not answered yet').not.toBeNull();
  for (const probe of PROBES) {
    const got = placeSpot(actual as Transform, probe);
    const want = placeSpot(expected, probe);
    got.forEach((value, i) => expect(value, `${name} puts (${probe.join(', ')}): ${'xyz'[i]}`).toBeCloseTo(want[i], DECIMALS));
  }
}

// Fails if a drill function changed a saved transform it was handed or read, like calling invert()
// on object.matrixWorld itself. `before` is a copy taken before the call.
export function expectMatrixUnchanged(matrix: Transform, before: Transform, name: string) {
  expect(Array.from(matrix.elements), `${name} was changed: clone it before calling a method that changes it`).toEqual(
    Array.from(before.elements),
  );
}

// ---- For drill functions that take or return turns (a Quaternion or an Euler) ----

type Turn = { x: number; y: number; z: number; w: number };
type TurnValue = Turn | { x: number; y: number; z: number; order: string };

// How far apart two turns are, in degrees. q and −q are the same turn, so this uses the size of
// their dot product, as Quaternion.angleTo does, and never compares the four numbers themselves.
export function degreesBetween(a: Turn, b: Turn) {
  const dot = Math.min(1, Math.abs(a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w));
  return (2 * Math.acos(dot) * 180) / Math.PI;
}

// An answer that's a turn: it must have length 1, as every turn does, and be within 0.06° (about
// 0.001 radians) of `expected`. For an answer that's an Euler, pass new Quaternion().setFromEuler(it).
export function expectTurn(actual: Answer<Turn>, expected: Turn, name = 'turn') {
  expect(actual, 'not answered yet').not.toBeNull();
  const turn = actual as Turn;
  const length = Math.hypot(turn.x, turn.y, turn.z, turn.w);
  expect(length, `${name} has length ${length}, so it isn't a pure turn`).toBeCloseTo(1, 6);
  expect(degreesBetween(turn, expected), `${name} is off by this many degrees`).toBeLessThan(0.06);
}

// Fails if a drill function changed a Quaternion or Euler it was handed. multiply, premultiply,
// invert, slerp, and every set… method change the one they're called on, so clone first. `before`
// is a copy taken before the call. An Euler's order counts too.
export function expectTurnUnchanged(value: TurnValue, before: TurnValue, name: string) {
  const numbers = (turn: TurnValue) => [turn.x, turn.y, turn.z, 'w' in turn ? turn.w : turn.order];
  expect(numbers(value), `${name} was changed: clone it before calling a method that changes it`).toEqual(numbers(before));
}
