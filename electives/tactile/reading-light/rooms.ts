// Where each HDRI's brightest light is, so a page can turn the room to put it where it wants, the way
// a photographer turns a set. Measured with vetHdri (tools/vet.ts): `around` is degrees from the
// panorama's middle toward its right, `above` degrees above the horizon. The overcast sky's brightest
// part is nearly overhead, so turning it changes little.
import * as THREE from 'three';
import type { Stage } from '../bench';

export const HDRI_KEY: Record<string, { around: number; above: number }> = {
  studio_small_09: { around: -24, above: 17 },
  cyclorama_hard_light: { around: 60, above: 17 },
  overcast_soil_puresky: { around: -31, above: 82 },
  christmas_photo_studio_01: { around: 48, above: 34 },
  blue_photo_studio: { around: 68, above: 21 },
};

// The turn (environmentRotation.y and backgroundRotation.y, in radians) that puts an HDRI's brightest
// light at `around` degrees, in the bench's key-light angles: 0 from the camera's side, -90 from the
// left. three.js maps a panorama's middle to +x, and a turn of θ about y moves what's at angle φ
// (from +x toward +z) to φ − θ.
export function turnFor(hdriId: string, around: number) {
  const key = HDRI_KEY[hdriId];
  if (!key) return 0;
  const target = 90 - around; // the bench's angle, as an angle from +x toward +z
  return THREE.MathUtils.degToRad(THREE.MathUtils.euclideanModulo(key.around - target + 180, 360) - 180);
}

// Keeps the stage's HDRI turned so its brightest light comes from `around` (the bench's key light
// starts at -60: front left), turning the background with it. Turns again whenever the HDRI changes.
export function keepKeyAt(stage: Stage, around = -60) {
  const { scene } = stage.harness;
  let turnedFor: string | null = null;
  stage.onChange(() => {
    if (!stage.hdriId || stage.hdriId === turnedFor) return;
    turnedFor = stage.hdriId;
    scene.environmentRotation.y = scene.backgroundRotation.y = turnFor(stage.hdriId, around);
  });
}
