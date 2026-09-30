import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { Vector3 } from 'three';
import { describe, it } from 'vitest';
import { stepToward } from './drill';

const START = new Vector3(1, 2, -0.5);
const SPEED = 3;
const DELTA = 1 / 60;
const STEP = SPEED * DELTA;

// A target `distance` away from START, off in a slanted direction.
const targetAt = (distance: number) => new Vector3(2, -0.5, 1).setLength(distance).add(START);

const step = (target: Vector3, position = START) => answered(stepToward(position.clone(), target.clone(), SPEED, DELTA));

describe('stepToward', () => {
  it('moves speed × delta straight toward the target', () => {
    const target = targetAt(4);
    const next = step(target);
    expectNumber(next.distanceTo(START), STEP);
    expectNumber(next.distanceTo(target), 4 - STEP);
  });

  it('gives near and far targets the same step', () => {
    for (const distance of [0.5, 25]) {
      expectNumber(step(targetAt(distance)).distanceTo(START), STEP);
    }
  });

  it('lands exactly on a target closer than one step', () => {
    const target = targetAt(STEP * 0.4);
    expectVector(step(target), target, 'next position');
  });

  it("stays on the target once it's there, with no NaN", () => {
    const target = targetAt(3);
    expectVector(step(target, target), target, 'next position');
  });

  it("doesn't change position or target", () => {
    const target = targetAt(4);
    const [position, given] = [START.clone(), target.clone()];
    answered(stepToward(position, given, SPEED, DELTA));
    expectUnchanged(position, START, 'position');
    expectUnchanged(given, target, 'target');
  });
});
