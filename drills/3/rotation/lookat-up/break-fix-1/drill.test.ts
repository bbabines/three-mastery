import { expectUnchanged } from '@harness/check';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';
import { aimCamera } from './drill';

function expected(position: Vector3, target: Vector3, up: Vector3): Quaternion {
  const camera = new PerspectiveCamera();
  camera.position.copy(position);
  camera.up.copy(up);
  camera.lookAt(target);
  return camera.quaternion.clone();
}

describe('aimCamera', () => {
  it('keeps the requested top of a top-down view', () => {
    const camera = new PerspectiveCamera();
    camera.position.set(0, 4, 0.5);
    const target = new Vector3(0, 0, 0), up = new Vector3(0, 0, -1);
    expect(aimCamera(camera, target, up).angleTo(expected(camera.position, target, up))).toBeLessThan(1e-5);
  });

  it('works for a slanted camera and another up direction', () => {
    const camera = new PerspectiveCamera();
    camera.position.set(2, 3, 1);
    const target = new Vector3(0.3, 0.2, -1), up = new Vector3(1, 0, 0);
    expect(aimCamera(camera, target, up).angleTo(expected(camera.position, target, up))).toBeLessThan(1e-5);
  });

  it('does not change target, up, or camera position', () => {
    const camera = new PerspectiveCamera();
    camera.position.set(0, 4, 0.5);
    const target = new Vector3(0, 0, 0), up = new Vector3(0, 0, -1);
    aimCamera(camera, target, up);
    expectUnchanged(camera.position, new Vector3(0, 4, 0.5), 'camera position');
    expectUnchanged(target, new Vector3(), 'target');
    expectUnchanged(up, new Vector3(0, 0, -1), 'world up');
  });
});
