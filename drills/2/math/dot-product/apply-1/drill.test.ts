import { answered, expectUnchanged } from '@harness/check';
import { MathUtils, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { facesCamera } from './drill';

const UP = new Vector3(0, 1, 0);
const CENTER = new Vector3(0.5, 1, -0.3);

// Hotspots all over a round product, each with the way the surface faces there.
const HOTSPOTS = [-60, -20, 20, 60].flatMap((tilt) =>
  Array.from({ length: 12 }, (_, i) => {
    const out = new Vector3(0, 0, 1).applyAxisAngle(UP, MathUtils.degToRad(i * 30 + 10));
    out.applyAxisAngle(new Vector3().crossVectors(out, UP).normalize(), MathUtils.degToRad(tilt));
    return { spot: out.clone().multiplyScalar(0.8).add(CENTER), normal: out };
  }),
);

const CAMERAS = [new Vector3(3, 2, 4), new Vector3(-2.5, 0.5, -1), new Vector3(0.4, 30, -2), new Vector3(-80, -10, 45)];

// What three.js's own angleTo says: the surface faces the camera when the move to the camera is
// less than a right angle from the normal. Hotspots seen almost exactly edge-on are left out.
function mistakes(normalLength: number) {
  return CAMERAS.flatMap((cameraPosition) =>
    HOTSPOTS.flatMap(({ spot, normal }) => {
      const scaled = normal.clone().setLength(normalLength);
      const angle = scaled.angleTo(cameraPosition.clone().sub(spot));
      if (Math.abs(angle - Math.PI / 2) < 1e-6) return [];
      const expected = angle < Math.PI / 2;
      const answer = answered(facesCamera(spot.clone(), scaled, cameraPosition.clone()));
      return answer === expected ? [] : [`camera ${cameraPosition.toArray()}, spot facing ${normal.toArray().map((n) => n.toFixed(2))}`];
    }),
  );
}

describe('facesCamera', () => {
  it('agrees with angleTo for hotspots facing every way', () => {
    expect(mistakes(1), 'hotspots facesCamera got wrong').toEqual([]);
  });

  it('works whatever length the normal is', () => {
    expect(mistakes(0.05), 'normal of length 0.05').toEqual([]);
    expect(mistakes(12), 'normal of length 12').toEqual([]);
  });

  it("doesn't change any of the vectors", () => {
    const { spot, normal } = HOTSPOTS[7];
    const [s, n, c] = [spot.clone(), normal.clone(), CAMERAS[0].clone()];
    answered(facesCamera(s, n, c));
    expectUnchanged(s, spot, 'spot');
    expectUnchanged(n, normal, 'normal');
    expectUnchanged(c, CAMERAS[0], 'cameraPosition');
  });
});
