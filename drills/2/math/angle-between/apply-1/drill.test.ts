import { answered, expectNumber, expectUnchanged } from '@harness/check';
import { MathUtils, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { heading } from './drill';

const UP = new Vector3(0, 1, 0);
const NORTH = new Vector3(0, 0, -1);
const HEADINGS = [0, 30, 90, 135, 180, 210, 270, 330, 359.5];

// A direction with a known heading, built with three.js's applyAxisAngle: clockwise as seen from
// above is a negative turn around +Y. Then tilted up or down, and stretched.
function direction(degrees: number, tilt = 0, length = 1) {
  const flat = NORTH.clone().applyAxisAngle(UP, -MathUtils.degToRad(degrees));
  const side = new Vector3().crossVectors(flat, UP);
  return flat.applyAxisAngle(side, MathUtils.degToRad(tilt)).multiplyScalar(length);
}

// How far apart two headings are the short way round, so 359.9999 and 0 count as the same.
const gap = (a: number, b: number) => Math.abs(((((a - b) % 360) + 540) % 360) - 180);

describe('heading', () => {
  it('gives back known headings all the way round', () => {
    for (const degrees of HEADINGS) {
      const answer = answered(heading(direction(degrees)));
      expectNumber(gap(answer, degrees), 0);
    }
  });

  it("ignores tilt and the direction's length", () => {
    for (const degrees of HEADINGS) {
      for (const [tilt, length] of [[50, 0.2], [-60, 7]]) {
        const answer = answered(heading(direction(degrees, tilt, length)));
        expectNumber(gap(answer, degrees), 0);
      }
    }
  });

  it('is at least 0 and under 360', () => {
    for (const degrees of HEADINGS) {
      const answer = answered(heading(direction(degrees, 20)));
      expect(answer, `heading for ${degrees}°`).toBeGreaterThanOrEqual(0);
      expect(answer, `heading for ${degrees}°`).toBeLessThan(360);
    }
  });

  it("doesn't change the direction", () => {
    const original = direction(210, 30, 3);
    const given = original.clone();
    answered(heading(given));
    expectUnchanged(given, original, 'direction');
  });
});
