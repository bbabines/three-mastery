import { answered, expectExact, expectUnchanged } from '@harness/check';
import { Triangle, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { isDegenerate } from './drill';

// Three corners on one line: a start, then 1 and 2.7 steps along.
function onALine(start: Vector3, step: Vector3) {
  return [start.clone(), start.clone().add(step), start.clone().addScaledVector(step, 2.7)] as const;
}

// A thin triangle that's really there: `length` long and 1% as wide.
function thin(start: Vector3, length: number) {
  const along = new Vector3(1, 0.2, -0.4).setLength(length);
  const across = new Vector3(0.2, -1, 0).projectOnPlane(along).setLength(length * 0.01);
  return [start.clone(), start.clone().add(along), start.clone().addScaledVector(along, 0.4).add(across)] as const;
}

const area = (corners: readonly Vector3[]) => new Triangle(corners[0], corners[1], corners[2]).getArea();
const check = (corners: readonly Vector3[]) => isDegenerate(corners[0].clone(), corners[1].clone(), corners[2].clone());

describe('isDegenerate', () => {
  it('finds corners on a line', () => {
    expectExact(check(onALine(new Vector3(0, 0, 0), new Vector3(1, 2, 3))), true);
  });

  it('finds corners on a line when rounding leaves a tiny area', () => {
    const corners = onALine(new Vector3(1.3, 0.7, -0.4), new Vector3(0.137, 0.311, 0.443));
    expect(area(corners), 'this case should leave a tiny area, not 0').toBeGreaterThan(0);
    expectExact(check(corners), true);
  });

  it('finds corners on a line in millimeters, thousands from the origin', () => {
    const corners = onALine(new Vector3(4123.7, 1400.3, -651.9), new Vector3(137.1, 311.7, 443.3));
    expect(area(corners), 'this case should leave an area over 1e-10').toBeGreaterThan(1e-10);
    expectExact(check(corners), true);
  });

  it('keeps a real triangle a tenth of a millimeter long', () => {
    const corners = thin(new Vector3(0.2, 0.1, 0.3), 1e-4);
    expect(area(corners), 'this case should have an area under 1e-10').toBeLessThan(1e-10);
    expectExact(check(corners), false);
  });

  it('keeps a thin triangle in millimeters, and an ordinary one', () => {
    expectExact(check(thin(new Vector3(2000, 1400, -600), 500)), false);
    expectExact(check([new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0)]), false);
  });

  it("doesn't change the corners", () => {
    const original = thin(new Vector3(0.2, 0.1, 0.3), 2);
    const [a, b, c] = original.map((corner) => corner.clone());
    answered(isDegenerate(a, b, c));
    expectUnchanged(a, original[0], 'a');
    expectUnchanged(b, original[1], 'b');
    expectUnchanged(c, original[2], 'c');
  });
});
