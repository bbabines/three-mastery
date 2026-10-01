import { answered } from '@harness/check';
import { Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { faceCamera } from './drill';

describe('faceCamera', () => {
  it('faces the camera position at a screen edge and optionally stays upright', () => {
    const p = new Vector3(2, 0, 0), camera = new Vector3(0, 3, 5);
    const full = answered(faceCamera(p, camera, false));
    const upright = answered(faceCamera(p, camera, true));
    const fullForward = new Vector3(0, 0, 1).applyQuaternion(full);
    const uprightForward = new Vector3(0, 0, 1).applyQuaternion(upright);
    expect(fullForward.dot(camera.clone().sub(p).normalize())).toBeCloseTo(1);
    expect(uprightForward.y).toBeCloseTo(0);
    expect(uprightForward.dot(camera.clone().sub(p).setY(0).normalize())).toBeCloseTo(1);
    expect(p).toEqual(new Vector3(2, 0, 0)); expect(camera).toEqual(new Vector3(0, 3, 5));
  });
});
