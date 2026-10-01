import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { localHit } from './drill';

describe('localHit', () => {
  it('undoes a translated, turned, and non-uniformly scaled part', () => {
    const part = new Object3D();
    part.position.set(3, 1, -2);
    part.rotation.y = 0.6;
    part.scale.set(2, 0.5, 1.3);
    const localPoint = new Vector3(0.3, -0.2, 0.4);
    const worldHit = part.localToWorld(localPoint.clone());
    expectVector(localHit(part, worldHit), part.worldToLocal(worldHit.clone()));
  });

  it('works under a moved parent', () => {
    const parent = new Object3D();
    parent.position.set(-5, 2, 4);
    parent.rotation.z = 0.3;
    const part = new Object3D();
    part.position.set(1, 0, -1);
    part.scale.set(0.7, 1.4, 2);
    parent.add(part);
    const worldHit = part.localToWorld(new Vector3(0.2, 0.4, 0.1));
    expectVector(localHit(part, worldHit), part.worldToLocal(worldHit.clone()));
  });

  it('does not change the clicked world point', () => {
    const part = new Object3D();
    part.position.set(2, 0, 0);
    const hit = new Vector3(2.5, 0.3, 0);
    localHit(part, hit);
    expectUnchanged(hit, new Vector3(2.5, 0.3, 0), 'world hit');
  });
});
