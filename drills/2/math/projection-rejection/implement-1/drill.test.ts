import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { Vector3 } from 'three';
import { describe, it } from 'vitest';
import { alongRail } from './drill';

const RAILS = [
  new Vector3(1, 0, -0.7), // at an angle across the floor
  new Vector3(2, 0.5, -1), // climbing
  new Vector3(0, 0, 3), // lined up with Z
];
const DRAGS = [new Vector3(1.5, 0, 0.8), new Vector3(-0.4, 0.3, -2.2), new Vector3(2, -1, 1)];

describe('alongRail', () => {
  it('runs along the rail', () => {
    for (const rail of RAILS) {
      for (const drag of DRAGS) {
        const along = answered(alongRail(drag.clone(), rail.clone()));
        // Along the rail means at no angle to it: crossing the two gives nothing.
        expectNumber(new Vector3().crossVectors(along, rail).length(), 0);
      }
    }
  });

  it("leaves what's left of the drag at right angles to the rail", () => {
    for (const rail of RAILS) {
      for (const drag of DRAGS) {
        const along = answered(alongRail(drag.clone(), rail.clone()));
        expectNumber(drag.clone().sub(along).dot(rail), 0);
      }
    }
  });

  it("doesn't depend on the rail's length", () => {
    const short = answered(alongRail(DRAGS[1].clone(), RAILS[1].clone().setLength(0.3)));
    const long = alongRail(DRAGS[1].clone(), RAILS[1].clone().setLength(40));
    expectVector(long, short, 'along a long rail');
  });

  it('keeps a drag along the rail whole, and drops one straight across it', () => {
    const rail = RAILS[0];
    const lengthwise = rail.clone().multiplyScalar(-1.7);
    expectVector(alongRail(lengthwise.clone(), rail.clone()), lengthwise, 'drag along the rail');
    const across = new Vector3().crossVectors(rail, new Vector3(0, 1, 0));
    expectVector(alongRail(across, rail.clone()), new Vector3(), 'drag straight across');
  });

  it("doesn't change drag or rail", () => {
    const [drag, rail] = [DRAGS[0].clone(), RAILS[1].clone()];
    answered(alongRail(drag, rail));
    expectUnchanged(drag, DRAGS[0], 'drag');
    expectUnchanged(rail, RAILS[1], 'rail');
  });
});
