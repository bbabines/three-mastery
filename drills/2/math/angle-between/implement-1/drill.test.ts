import { answered, expectNumber, expectUnchanged } from '@harness/check';
import { Vector3 } from 'three';
import { describe, it } from 'vitest';
import { dialTurn } from './drill';

// Two knobs: one on a panel facing you (+Z), and one facing a slanted way. `start` is the move from
// the knob's center to where a drag starts, on the knob's face.
const KNOBS = [
  { center: new Vector3(1, 1.5, 0), axis: new Vector3(0, 0, 1), start: new Vector3(0, 0.4, 0) },
  { center: new Vector3(0.5, 1.2, -0.3), axis: new Vector3(1, -1, 0).multiplyScalar(3), start: new Vector3(0.25, 0.25, 0.25) },
];
const ANGLES = [0.3, -0.3, 1.2, -1.2, 2.9, -2.9];

// A drag turned `angle` radians around the knob's axis, using three.js's applyAxisAngle, and ending
// farther from the center than it started, since only the turn should count.
function drag(knob: (typeof KNOBS)[number], angle: number) {
  const from = knob.center.clone().add(knob.start);
  const turned = knob.start.clone().applyAxisAngle(knob.axis.clone().normalize(), angle).multiplyScalar(1.6);
  return { from, to: knob.center.clone().add(turned) };
}

describe('dialTurn', () => {
  it('gives back the angle a drag turned, both ways', () => {
    const knob = KNOBS[0];
    for (const angle of ANGLES) {
      const { from, to } = drag(knob, angle);
      expectNumber(dialTurn(knob.center.clone(), from, to, knob.axis.clone()), angle);
    }
  });

  it('works on a knob facing a slanted way', () => {
    const knob = KNOBS[1];
    for (const angle of ANGLES) {
      const { from, to } = drag(knob, angle);
      expectNumber(dialTurn(knob.center.clone(), from, to, knob.axis.clone()), angle);
    }
  });

  it("gives 0, not NaN, for a drag that hasn't moved", () => {
    // Normalized, these two directions agree by a hair more than 1 after rounding, and Math.acos of
    // anything over 1 is NaN.
    const knob = KNOBS[1];
    const from = knob.center.clone().add(knob.start);
    expectNumber(dialTurn(knob.center.clone(), from.clone(), from.clone(), knob.axis.clone()), 0);
  });

  it("doesn't change any of the vectors", () => {
    const knob = KNOBS[0];
    const { from, to } = drag(knob, 1.2);
    const [c, f, t, a] = [knob.center.clone(), from.clone(), to.clone(), knob.axis.clone()];
    answered(dialTurn(c, f, t, a));
    expectUnchanged(c, knob.center, 'center');
    expectUnchanged(f, from, 'from');
    expectUnchanged(t, to, 'to');
    expectUnchanged(a, knob.axis, 'axis');
  });
});
