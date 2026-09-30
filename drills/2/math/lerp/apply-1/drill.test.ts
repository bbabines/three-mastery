import { answered, expectNumber, expectUnchanged, expectVector } from '@harness/check';
import { MathUtils, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { flightPoint, type City } from './drill';

// A globe away from the origin, so the answer has to be measured from its center.
const CENTER = new Vector3(0.5, 1.6, -0.3);
const RADIUS = 1.2;
const ROUTES: [City, City][] = [
  [{ lat: 40.7, lon: -74 }, { lat: 51.5, lon: -0.1 }],
  [{ lat: -33.9, lon: 18.4 }, { lat: 1.3, lon: 103.8 }],
];

// Where three.js puts a city: setFromSphericalCoords measures phi down from +Y, which is 90° minus
// the latitude, and theta around from +Z toward +X, which is the longitude.
const place = (city: City) =>
  new Vector3().setFromSphericalCoords(RADIUS, MathUtils.degToRad(90 - city.lat), MathUtils.degToRad(city.lon)).add(CENTER);

const fly = (from: City, to: City, t: number) => answered(flightPoint(CENTER.clone(), RADIUS, { ...from }, { ...to }, t));

describe('flightPoint', () => {
  it('starts at from and ends at to', () => {
    for (const [from, to] of ROUTES) {
      expectVector(fly(from, to, 0), place(from), 'at t = 0');
      expectVector(fly(from, to, 1), place(to), 'at t = 1');
    }
  });

  it('stays on the surface all the way', () => {
    for (const [from, to] of ROUTES) {
      for (let step = 0; step <= 10; step++) {
        expectNumber(fly(from, to, step / 10).distanceTo(CENTER), RADIUS);
      }
    }
  });

  it('is at the blended latitude and longitude partway along', () => {
    for (const [from, to] of ROUTES) {
      for (const t of [0.25, 0.5, 0.8]) {
        const expected = place({ lat: MathUtils.lerp(from.lat, to.lat, t), lon: MathUtils.lerp(from.lon, to.lon, t) });
        expectVector(fly(from, to, t), expected, `at t = ${t}`);
      }
    }
  });

  it('puts a city on the equator level with the center', () => {
    expectNumber(fly({ lat: 0, lon: 30 }, { lat: 0, lon: 80 }, 0.5).y, CENTER.y);
  });

  it("doesn't change center, from, or to", () => {
    const [from, to] = ROUTES[0];
    const [center, givenFrom, givenTo] = [CENTER.clone(), { ...from }, { ...to }];
    answered(flightPoint(center, RADIUS, givenFrom, givenTo, 0.4));
    expectUnchanged(center, CENTER, 'center');
    expect(givenFrom, 'from was changed').toEqual(from);
    expect(givenTo, 'to was changed').toEqual(to);
  });
});
