import { answered, expectExact, expectUnchanged } from '@harness/check';
import { MathUtils, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { turnAt, type Turn } from './drill';

const UP = new Vector3(0, 1, 0);

// A corner where the route turns by `degrees` around Y: positive turns counter-clockwise as seen
// from above, which is a left turn for the robot.
function corner(degrees: number, height = 0, heading = new Vector3(1, 0, -0.4)) {
  const at = new Vector3(1.3, height, -0.7);
  const arriving = heading.clone().normalize();
  const leaving = arriving.clone().applyAxisAngle(UP, MathUtils.degToRad(degrees));
  return {
    previous: at.clone().addScaledVector(arriving, -2.2),
    corner: at,
    next: at.clone().addScaledVector(leaving, 3.1),
    expected: (degrees > 0 ? 'left' : 'right') as Turn,
  };
}

const TURNS = [15, 60, 90, 150, -15, -60, -90, -150];

describe('turnAt', () => {
  it('names left and right turns of every size', () => {
    const wrong = TURNS.flatMap((degrees) => {
      const route = corner(degrees);
      const answer = answered(turnAt(route.previous, route.corner, route.next));
      return answer === route.expected ? [] : [`${degrees}° should be ${route.expected}`];
    });
    expect(wrong, 'turns turnAt got wrong').toEqual([]);
  });

  it('works on a route above the floor', () => {
    for (const degrees of [70, -70]) {
      const route = corner(degrees, 2.4, new Vector3(-0.3, 0, 1));
      expectExact(turnAt(route.previous, route.corner, route.next), route.expected);
    }
  });

  it('flips each answer when the route is driven the other way', () => {
    for (const degrees of [40, -110]) {
      const route = corner(degrees);
      expectExact(turnAt(route.next, route.corner, route.previous), route.expected === 'left' ? 'right' : 'left');
    }
  });

  it("calls three points in a line 'straight', even with rounding", () => {
    // These three leave a cross product with an up part of about 0.00000000000000006, not 0.
    const step = new Vector3(0.1, 0, 0.3);
    const [a, b, c] = [1, 2, 3].map((k) => step.clone().multiplyScalar(k).add(new Vector3(0.7, 0, 0.2)));
    expectExact(turnAt(a, b, c), 'straight');
  });

  it("doesn't change any of the points", () => {
    const route = corner(60);
    const [previous, middle, next] = [route.previous.clone(), route.corner.clone(), route.next.clone()];
    answered(turnAt(previous, middle, next));
    expectUnchanged(previous, route.previous, 'previous');
    expectUnchanged(middle, route.corner, 'corner');
    expectUnchanged(next, route.next, 'next');
  });
});
