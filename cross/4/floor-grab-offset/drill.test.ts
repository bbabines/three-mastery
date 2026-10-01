import { answered, expectUnchanged, expectVector } from '@harness/check';
import { Plane, Ray, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { dragFloor } from './drill';

describe('floor grab offset', () => {
  it('keeps the offset on a sloping ray', () => {
    const ray = new Ray(new Vector3(4, 6, 2), new Vector3(-1, -2, 1).normalize());
    const grab = new Vector3(1, 0.7, 1);
    const origin = new Vector3(0.2, 0.4, -0.5);
    const hit = ray.intersectPlane(new Plane(new Vector3(0, 1, 0), -grab.y), new Vector3())!;
    expectVector(dragFloor(ray, grab, origin), hit.add(origin.clone().sub(grab)));
    expectUnchanged(grab, new Vector3(1, 0.7, 1), 'grabbed');
    expectUnchanged(origin, new Vector3(0.2, 0.4, -0.5), 'origin');
  });
  it('holds the part when there is no forward hit', () => {
    const ray = new Ray(new Vector3(0, 2, 0), new Vector3(1, 0, 0));
    expectVector(dragFloor(ray, new Vector3(0, 0, 0), new Vector3(2, 0, 3)), new Vector3(2, 0, 3));
    answered(dragFloor(ray, new Vector3(0, 0, 0), new Vector3(2, 0, 3)));
  });
});
