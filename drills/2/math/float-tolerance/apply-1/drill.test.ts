import { answered, expectExact, expectUnchanged } from '@harness/check';
import { Object3D, Plane, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { isFlatPanel } from './drill';

const TOLERANCE = 0.001;

// A flat 1.2 × 0.8 panel, turned and moved by an Object3D's matrix, the way a CAD export places it.
function panel() {
  const placement = new Object3D();
  placement.position.set(2.1, 0.4, -1.3);
  placement.rotation.set(0.9, -0.4, 1.1);
  placement.updateMatrixWorld();
  return [
    new Vector3(0, 0, 0),
    new Vector3(1.2, 0, 0),
    new Vector3(1.2, 0.8, 0),
    new Vector3(0, 0.8, 0),
  ].map((corner) => corner.applyMatrix4(placement.matrixWorld));
}

// The panel with corner d pushed `amount` off the surface, along the plane's normal.
function bent(amount: number) {
  const [a, b, c, d] = panel();
  const plane = new Plane().setFromCoplanarPoints(a, b, c);
  return [a, b, c, d.addScaledVector(plane.normal, amount)];
}

const check = (corners: Vector3[]) =>
  isFlatPanel(corners[0].clone(), corners[1].clone(), corners[2].clone(), corners[3].clone(), TOLERANCE);

describe('isFlatPanel', () => {
  it('counts a turned panel as flat, though rounding leaves it a hair off', () => {
    const corners = panel();
    const off = new Plane().setFromCoplanarPoints(corners[0], corners[1], corners[2]).distanceToPoint(corners[3]);
    expect(off, 'this case should leave d a hair off the surface, not exactly on it').not.toBe(0);
    expectExact(check(corners), true);
  });

  it('flags a panel bent more than the tolerance', () => {
    expectExact(check(bent(3 * TOLERANCE)), false);
  });

  it('flags a panel bent the other way just as much', () => {
    expectExact(check(bent(-3 * TOLERANCE)), false);
  });

  it('allows bends within the tolerance, either way', () => {
    expectExact(check(bent(0.5 * TOLERANCE)), true);
    expectExact(check(bent(-0.5 * TOLERANCE)), true);
  });

  it("doesn't change the corners", () => {
    const original = bent(0.2);
    const given = original.map((corner) => corner.clone());
    answered(isFlatPanel(given[0], given[1], given[2], given[3], TOLERANCE));
    given.forEach((corner, i) => expectUnchanged(corner, original[i], 'abcd'[i]));
  });
});
