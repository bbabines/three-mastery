// One describe block per concept id, so `pick -- done` can log which parts missed.
import { expectExact, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { MathUtils, Object3D, Spherical, Triangle, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import {
  aimAt,
  bounce,
  faceNormal,
  inRange,
  isBehind,
  isMirrored,
  moveFor,
  orbitPosition,
  positionAt,
  samePlace,
  slideAlongWall,
  turnToward,
} from './check';

const UP = new Vector3(0, 1, 0);

describe('math.point-vs-direction', () => {
  it('moves by velocity × seconds, leaving the inputs alone', () => {
    const [position, velocity] = [new Vector3(1, 0.5, -2), new Vector3(0.4, 0, 1.5)];
    const [p, v] = [position.clone(), velocity.clone()];
    expectVector(moveFor(p, v, 2.5), position.clone().addScaledVector(velocity, 2.5), 'position');
    expectUnchanged(p, position, 'position');
    expectUnchanged(v, velocity, 'velocity');
  });
});

describe('math.length', () => {
  it('compares distance with the radius, big or small', () => {
    const a = new Vector3(1, 1, 1);
    for (const [offset, radius] of [[0.6, 0.5], [0.4, 0.5], [9, 10], [11, 10]]) {
      const b = new Vector3(2, -1, 2).setLength(offset).add(a);
      expectExact(inRange(a.clone(), b, radius), a.distanceTo(b) <= radius);
    }
  });
});

describe('math.normalize', () => {
  it('gives a length-1 direction, and (0, 0, 0) for the same place', () => {
    const [from, to] = [new Vector3(1, 2, 3), new Vector3(-2, 6, 3)];
    expectVector(aimAt(from.clone(), to.clone()), to.clone().sub(from).normalize(), 'direction');
    expectVector(aimAt(from.clone(), from.clone()), new Vector3(), 'same place');
  });
});

describe('math.dot-product', () => {
  it('tells behind from in front', () => {
    const [position, forward] = [new Vector3(1, 0, 1), new Vector3(0, 0, -3)];
    for (const target of [new Vector3(2, 0, 3), new Vector3(-4, 1, -0.5), new Vector3(1, 5, 1.2)]) {
      const expected = forward.angleTo(target.clone().sub(position)) > Math.PI / 2;
      expectExact(isBehind(position.clone(), forward.clone(), target), expected);
    }
  });
});

describe('math.cross-product', () => {
  it('gives the length-1 direction a counter-clockwise triangle faces', () => {
    const [a, b, c] = [new Vector3(0, 0, 0), new Vector3(3, 0, 0.5), new Vector3(1, 2, -1)];
    expectVector(faceNormal(a.clone(), b.clone(), c.clone()), Triangle.getNormal(a, b, c, new Vector3()), 'normal');
  });
});

describe('math.projection-rejection', () => {
  it('slides along the wall only when moving into it', () => {
    const normal = new Vector3(1, 0, 1).multiplyScalar(2); // a wall at an angle
    const into = new Vector3(-3, 0.5, -1);
    expectVector(slideAlongWall(into.clone(), normal.clone()), into.clone().projectOnPlane(normal), 'into the wall');
    const away = new Vector3(2, 0, -1);
    expectVector(slideAlongWall(away.clone(), normal.clone()), away, 'away from the wall');
  });
});

describe('math.reflection', () => {
  it('bounces off a normal of any length', () => {
    const [velocity, normal] = [new Vector3(2, -3, 0.5), new Vector3(0.3, 1, 0).multiplyScalar(4)];
    expectVector(bounce(velocity.clone(), normal.clone()), velocity.clone().reflect(normal.clone().normalize()), 'bounce');
  });
});

describe('math.lerp', () => {
  it('moves over the duration and stops at the end', () => {
    const [start, end] = [new Vector3(0, 1, 0), new Vector3(4, 1, -2)];
    for (const elapsed of [0, 0.75, 1.5, 4]) {
      const expected = new Vector3().lerpVectors(start, end, MathUtils.clamp(elapsed / 1.5, 0, 1));
      expectVector(positionAt(start.clone(), end.clone(), elapsed, 1.5), expected, `at ${elapsed}s`);
    }
  });
});

describe('math.angle-between', () => {
  it('gives the signed turn, positive to the left', () => {
    const forward = new Vector3(1, 0, -1);
    for (const angle of [0.7, -0.7, 2.5, -2.5]) {
      const toTarget = forward.clone().applyAxisAngle(UP, angle).multiplyScalar(3);
      expectNumber(turnToward(forward.clone(), toTarget), angle);
    }
  });
});

describe('math.spherical-coords', () => {
  it('orbits the target, not the origin', () => {
    const target = new Vector3(2, 1, -3);
    const expected = new Vector3().setFromSpherical(new Spherical(5, 1.1, 0.6)).add(target);
    expectVector(orbitPosition(target.clone(), 5, 1.1, 0.6), expected, 'camera position');
  });
});

describe('math.triple-product', () => {
  it('spots mirrored axes', () => {
    for (const scale of [new Vector3(1, 1, 1), new Vector3(-1, 1, 1), new Vector3(2, -0.5, 3)]) {
      const object = new Object3D();
      object.rotation.set(0.4, 1.1, -0.3);
      object.scale.copy(scale);
      object.updateMatrixWorld();
      const [x, y, z] = [new Vector3(), new Vector3(), new Vector3()];
      object.matrixWorld.extractBasis(x, y, z);
      expectExact(isMirrored(x, y, z), object.matrixWorld.determinant() < 0);
    }
  });
});

describe('math.float-tolerance', () => {
  it('matches positions that differ only by rounding', () => {
    const p = new Vector3(0.1, 0.2, 0.3).add(new Vector3(0.2, 0.1, 0));
    const q = new Vector3(0.3, 0.3, 0.3);
    expect(p.equals(q), 'these should differ by rounding').toBe(false);
    expectExact(samePlace(p, q), true);
    expectExact(samePlace(p, q.clone().add(new Vector3(0, 0.001, 0))), false);
  });
});
