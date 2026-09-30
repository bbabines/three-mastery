import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { Matrix4, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { axesFor } from './drill';

const FORWARDS = [
  new Vector3(0, 0, -1),
  new Vector3(0, 0, 1),
  new Vector3(3, 1, -2),
  new Vector3(-0.5, -2, 4),
  new Vector3(1, 0, 0),
  new Vector3(-2, 5, 0.3),
];
const WORLD_UPS = [new Vector3(0, 1, 0), new Vector3(0.2, 1, 0.1)];

// The axes three.js builds when an object at the origin looks along `forward`: Matrix4.lookAt puts
// the right in the first column and the up in the second.
function lookAtAxes(forward: Vector3, worldUp: Vector3) {
  const matrix = new Matrix4().lookAt(new Vector3(), forward, worldUp);
  return { right: new Vector3().setFromMatrixColumn(matrix, 0), up: new Vector3().setFromMatrixColumn(matrix, 1) };
}

describe('axesFor', () => {
  it('matches the right and up three.js builds for lookAt', () => {
    for (const worldUp of WORLD_UPS) {
      for (const forward of FORWARDS) {
        const axes = answered(axesFor(forward.clone(), worldUp.clone()));
        const expected = lookAtAxes(forward, worldUp);
        expectVector(axes.right, expected.right, `right for forward (${forward.toArray()})`);
        expectVector(axes.up, expected.up, `up for forward (${forward.toArray()})`);
      }
    }
  });

  it("gives length-1 axes whatever the inputs' lengths", () => {
    for (const scale of [0.01, 50]) {
      const axes = answered(axesFor(FORWARDS[2].clone().multiplyScalar(scale), WORLD_UPS[1].clone().multiplyScalar(scale)));
      expectNumber(axes.right.length(), 1);
      expectNumber(axes.up.length(), 1);
    }
  });

  it('still gives two usable directions looking straight up or down', () => {
    for (const forward of [new Vector3(0, 2.5, 0), new Vector3(0, -0.3, 0)]) {
      const { right, up } = answered(axesFor(forward.clone(), new Vector3(0, 1, 0)));
      expectNumber(right.length(), 1);
      expectNumber(up.length(), 1);
      expectNumber(right.dot(forward), 0);
      expectNumber(up.dot(forward), 0);
      expectNumber(right.dot(up), 0);
    }
  });

  it("doesn't change forward or worldUp", () => {
    const [forward, worldUp] = [FORWARDS[2].clone(), WORLD_UPS[1].clone()];
    answered(axesFor(forward, worldUp));
    expectUnchanged(forward, FORWARDS[2], 'forward');
    expectUnchanged(worldUp, WORLD_UPS[1], 'worldUp');
  });
});
