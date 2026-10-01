import { expectVector } from '@harness/check';
import { Euler, Quaternion, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { cameraTurn } from './drill';
describe('cameraTurn', () => {
  it('applies yaw before local pitch when both are nonzero', () => {
    for (const [yaw, pitch] of [[0.7, 0.35], [-1.1, 0.5], [0.3, -0.65]]) {
      const expected = new Quaternion().setFromEuler(new Euler(pitch, yaw, 0, 'YXZ'));
      expectVector(new Vector3(0, 0, -1).applyQuaternion(cameraTurn(yaw, pitch)), new Vector3(0, 0, -1).applyQuaternion(expected), 'camera forward');
      expectVector(new Vector3(0, 1, 0).applyQuaternion(cameraTurn(yaw, pitch)), new Vector3(0, 1, 0).applyQuaternion(expected), 'camera up');
    }
  });
});
