import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { Line3, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { keepClear } from './drill';

// A pipe at an angle to every axis.
const START = new Vector3(-2, 1.5, -1);
const END = new Vector3(2.5, 2.2, 1);
const CLEARANCE = 0.6;

// The nearest point on the pipe, from three.js's Line3.
const nearest = (point: Vector3) => new Line3(START, END).closestPointToPoint(point, true, new Vector3());

// A point `distance` from the pipe at fraction `t` along it, off to one side.
function near(t: number, distance: number, side = new Vector3(0.3, 1, -0.5)) {
  const onPipe = new Vector3().lerpVectors(START, END, t);
  const out = side.clone().projectOnPlane(END.clone().sub(START)).setLength(distance);
  return onPipe.add(out);
}

const run = (point: Vector3) => answered(keepClear(point.clone(), START.clone(), END.clone(), CLEARANCE));

describe('keepClear', () => {
  it("leaves a point that's already clear where it is", () => {
    const point = near(0.4, 1.1);
    expectVector(run(point), point, 'clear point');
  });

  it('pushes a close point out to exactly the clearance', () => {
    for (const [t, distance] of [[0.3, 0.2], [0.7, 0.45], [0.5, 0.05]]) {
      const pushed = run(near(t, distance));
      expectNumber(pushed.distanceTo(nearest(pushed)), CLEARANCE);
    }
  });

  it('pushes it straight out: the nearest point on the pipe stays the same', () => {
    const point = near(0.6, 0.3, new Vector3(-1, 0.2, 0.8));
    expectVector(nearest(run(point)), nearest(point), 'nearest point on the pipe');
  });

  it("pushes a point past the pipe's end away from the end", () => {
    const past = END.clone().add(END.clone().sub(START).setLength(0.25)).add(new Vector3(0, 0.1, 0));
    const pushed = run(past);
    expectNumber(pushed.distanceTo(END), CLEARANCE);
    expectVector(pushed.clone().sub(END).normalize(), past.clone().sub(END).normalize(), 'direction away from the end');
  });

  it("doesn't change any of the vectors", () => {
    const point = near(0.3, 0.2);
    const [p, start, end] = [point.clone(), START.clone(), END.clone()];
    answered(keepClear(p, start, end, CLEARANCE));
    expectUnchanged(p, point, 'point');
    expectUnchanged(start, START, 'pipeStart');
    expectUnchanged(end, END, 'pipeEnd');
  });
});
