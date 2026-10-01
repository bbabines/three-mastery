import { answered, expectNumber } from '@harness/check';
import { Group, Object3D, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { nearestBin, worldGap } from './drill';

function aisle() {
  const cart = new Group();
  const rackA = new Group();
  const rackB = new Group();
  const robot = new Object3D();
  const a = new Object3D();
  const b = new Object3D();
  cart.position.set(1, 0, 2);
  rackA.position.set(-3, 0, 0);
  rackB.position.set(2, 0, -2);
  rackB.rotation.y = Math.PI / 3;
  robot.position.set(0.5, 1, 0);
  a.position.set(1, 1, 0);
  b.position.set(-1, 1, 0);
  cart.add(robot);
  rackA.add(a);
  rackB.add(b);
  return { cart, rackA, rackB, robot, a, b };
}

describe('worldGap', () => {
  it('measures in the world, including unsaved parent moves', () => {
    const { cart, rackB, robot, b } = aisle();
    for (const x of [1, -2, 4]) {
      cart.position.x = x;
      rackB.rotation.y += 0.2;
      const expected = robot.getWorldPosition(new Vector3()).distanceTo(b.getWorldPosition(new Vector3()));
      expectNumber(worldGap(robot, b), expected);
    }
    expect(cart.position.x).toBe(4);
  });
});

describe('nearestBin', () => {
  it('picks the closest nested object after its parent moves', () => {
    const { cart, rackA, robot, a, b } = aisle();
    for (const x of [-3, 2, 6]) {
      cart.position.x = x;
      rackA.position.z = -x / 2;
      const robotWorld = robot.getWorldPosition(new Vector3());
      const distances = [a, b].map((bin) => robotWorld.distanceTo(bin.getWorldPosition(new Vector3())));
      expect(answered(nearestBin(robot, [a, b]))).toBe(distances.indexOf(Math.min(...distances)));
    }
  });
});
