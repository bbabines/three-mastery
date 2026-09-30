import { answered, expectUnchanged, expectVector } from '@harness/check';
import { Vector3 } from 'three';
import { describe, it } from 'vitest';
import { midpoint, moveBetween } from './drill';

const A = new Vector3(-2.5, 0.4, 1.2);
const B = new Vector3(1.75, 1.1, -0.6);
const SHIFT = new Vector3(3, -1, 2.5);

describe('moveBetween', () => {
  it('lands on b when added to a', () => {
    const move = answered(moveBetween(A.clone(), B.clone()));
    expectVector(A.clone().add(move), B, 'a + move');
  });

  it('stays the same when both parts shift together', () => {
    const before = answered(moveBetween(A.clone(), B.clone()));
    const after = answered(moveBetween(A.clone().add(SHIFT), B.clone().add(SHIFT)));
    expectVector(after, before, 'move after the shift');
  });

  it("doesn't change a or b", () => {
    const a = A.clone();
    const b = B.clone();
    answered(moveBetween(a, b));
    expectUnchanged(a, A, 'a');
    expectUnchanged(b, B, 'b');
  });
});

describe('midpoint', () => {
  it('is halfway between the parts', () => {
    expectVector(midpoint(A.clone(), B.clone()), new Vector3().lerpVectors(A, B, 0.5), 'midpoint');
  });

  it('shifts with the parts when both move together', () => {
    const before = answered(midpoint(A.clone(), B.clone()));
    const after = midpoint(A.clone().add(SHIFT), B.clone().add(SHIFT));
    expectVector(after, before.clone().add(SHIFT), 'midpoint after the shift');
  });

  it("doesn't change a or b", () => {
    const a = A.clone();
    const b = B.clone();
    answered(midpoint(a, b));
    expectUnchanged(a, A, 'a');
    expectUnchanged(b, B, 'b');
  });
});
