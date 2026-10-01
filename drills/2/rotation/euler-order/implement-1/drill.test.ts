import { answered, expectVector } from '@harness/check';
import { PerspectiveCamera, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { lookRotation } from './drill';

const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
// Headings all the way round, and tilts up and down.
const YAWS = [-2.8, -1.3, 0, 0.6, 1.9, 3.1];
const PITCHES = [-1.3, -0.6, 0.4, 1.2];
const VIEWS = YAWS.flatMap((yaw) => PITCHES.map((pitch) => ({ yaw, pitch })));

// A camera with no parent, turned by the answer.
function cameraFor(yaw: number, pitch: number) {
  const camera = new PerspectiveCamera();
  camera.rotation.copy(answered(lookRotation(yaw, pitch)));
  camera.updateMatrixWorld();
  return camera;
}

// Where the camera should look, worked out without any Euler angles: straight down −Z, tipped up by
// `pitch` around the world's X, then swung round by `yaw` around the world's upright Y.
const lookingFor = (yaw: number, pitch: number) => new Vector3(0, 0, -1).applyAxisAngle(X, pitch).applyAxisAngle(Y, yaw);

describe('lookRotation', () => {
  it('looks where the heading and tilt say', () => {
    for (const { yaw, pitch } of VIEWS) {
      const looking = cameraFor(yaw, pitch).getWorldDirection(new Vector3());
      expectVector(looking, lookingFor(yaw, pitch), `looking, for yaw ${yaw} and pitch ${pitch}`);
    }
  });

  it('keeps the horizon level, however far it tilts', () => {
    for (const { yaw, pitch } of VIEWS) {
      const side = X.clone().applyQuaternion(cameraFor(yaw, pitch).quaternion);
      expect(side.y, `the camera's own +X tips up or down, for yaw ${yaw} and pitch ${pitch}`).toBeCloseTo(0, 6);
    }
  });

  it('keeps the picture the right way up', () => {
    for (const { yaw, pitch } of VIEWS) {
      const top = Y.clone().applyQuaternion(cameraFor(yaw, pitch).quaternion);
      expect(top.y, `the top of the picture points down, for yaw ${yaw} and pitch ${pitch}`).toBeGreaterThan(0);
    }
  });
});
