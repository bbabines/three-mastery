import { answered, expectExact, expectUnchanged } from '@harness/check';
import { MathUtils, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { canSee } from './drill';

const EYE = new Vector3(1, 1.5, -2);
const FACING = new Vector3(1, -0.2, 0.5).multiplyScalar(3.5); // not length 1 on purpose
const UP = new Vector3(0, 1, 0);

// What three.js's own angleTo and distanceTo say, or undefined for a target so close to the cone's
// edge that either answer is fine.
function truth(facing: Vector3, target: Vector3, halfAngle: number, range: number) {
  const toTarget = target.clone().sub(EYE);
  const angle = facing.angleTo(toTarget);
  const limit = MathUtils.degToRad(halfAngle);
  if (Math.abs(toTarget.length() - range) < 1e-6 || Math.abs(angle - limit) < 1e-6) return undefined;
  return toTarget.length() <= range && angle <= limit;
}

// Targets all around the eye: every 20° around, tilted up and down, near and far.
const TARGETS = [0.6, 2.5, 3.9, 5.5].flatMap((distance) =>
  [-35, 0, 25].flatMap((tilt) =>
    Array.from({ length: 18 }, (_, i) => {
      const around = new Vector3(1, 0, 0).applyAxisAngle(UP, MathUtils.degToRad(i * 20 + 7));
      const side = new Vector3().crossVectors(around, UP);
      return around.applyAxisAngle(side, MathUtils.degToRad(tilt)).multiplyScalar(distance).add(EYE);
    }),
  ),
);

function mistakes(facing: Vector3, halfAngle: number, range: number) {
  return TARGETS.flatMap((target) => {
    const expected = truth(facing, target, halfAngle, range);
    if (expected === undefined) return [];
    const answer = answered(canSee(EYE.clone(), facing.clone(), target.clone(), halfAngle, range));
    return answer === expected ? [] : [`target at (${target.toArray().map((n) => n.toFixed(2)).join(', ')}): should be ${expected}`];
  });
}

describe('canSee', () => {
  it('sees a target straight ahead and in range', () => {
    const target = FACING.clone().setLength(2).add(EYE);
    expectExact(canSee(EYE.clone(), FACING.clone(), target, 30, 4), true);
  });

  it('agrees with angleTo and distanceTo all around the camera', () => {
    for (const halfAngle of [20, 45, 80]) {
      expect(mistakes(FACING, halfAngle, 4), `half angle ${halfAngle}°`).toEqual([]);
    }
  });

  it('works whatever length facing is', () => {
    expect(mistakes(FACING.clone().setLength(0.2), 45, 4), 'facing of length 0.2').toEqual([]);
    expect(mistakes(FACING.clone().setLength(9), 45, 4), 'facing of length 9').toEqual([]);
  });

  it('handles a cone wider than a right angle', () => {
    expect(mistakes(FACING, 120, 4.5), 'half angle 120°').toEqual([]);
  });

  it("doesn't change any of the vectors", () => {
    const [eye, facing, target] = [EYE.clone(), FACING.clone(), TARGETS[5].clone()];
    answered(canSee(eye, facing, target, 45, 4));
    expectUnchanged(eye, EYE, 'eye');
    expectUnchanged(facing, FACING, 'facing');
    expectUnchanged(target, TARGETS[5], 'target');
  });
});
