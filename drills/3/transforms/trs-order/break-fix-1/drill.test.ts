import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Quaternion, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { posePreview } from './drill';

function expected(position: Vector3, rotation: Quaternion, scale: Vector3, localPoint: Vector3) {
  const part = new Object3D();
  part.position.copy(position);
  part.quaternion.copy(rotation);
  part.scale.copy(scale);
  return part.localToWorld(localPoint.clone());
}

describe('posePreview', () => {
  it('puts a local marker on a non-uniformly scaled and turned part', () => {
    const position = new Vector3(2, 1, -3);
    const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.8);
    const scale = new Vector3(2, 0.7, 1.4);
    const localPoint = new Vector3(0.5, 0.2, -0.3);
    const result = posePreview(position, rotation, scale, localPoint);
    expectVector(result.worldPoint, expected(position, rotation, scale, localPoint));
    expectVector(result.recoveredScale, scale);
  });

  it('works for a turn around a slanted axis too', () => {
    const position = new Vector3(-1, 2, 4);
    const rotation = new Quaternion().setFromAxisAngle(new Vector3(1, 1, 0).normalize(), -0.6);
    const scale = new Vector3(0.6, 3, 1.2);
    const localPoint = new Vector3(0.4, -0.1, 0.7);
    const result = posePreview(position, rotation, scale, localPoint);
    expectVector(result.worldPoint, expected(position, rotation, scale, localPoint));
    expectVector(result.recoveredScale, scale);
  });

  it('does not change the pose inputs or local point', () => {
    const p = new Vector3(2, 1, -3);
    const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.8);
    const s = new Vector3(2, 0.7, 1.4);
    const point = new Vector3(0.5, 0.2, -0.3);
    const [ps, qs, ss, pts] = [p.clone(), q.clone(), s.clone(), point.clone()];
    posePreview(p, q, s, point);
    expectUnchanged(p, ps, 'position');
    expectUnchanged(s, ss, 'scale');
    expectUnchanged(point, pts, 'local point');
    if (!q.equals(qs)) throw new Error('rotation changed');
  });
});
