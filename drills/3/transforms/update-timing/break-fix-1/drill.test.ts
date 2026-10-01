import { expectUnchanged, expectVector } from '@harness/check';
import { Object3D, Vector3 } from 'three';
import { describe, it } from 'vitest';
import { movedAnchor } from './drill';

function pivotedPart() {
  const parent = new Object3D();
  parent.position.set(1, 0, -2);
  parent.rotation.y = 0.3;
  const part = new Object3D();
  part.pivot = new Vector3(-0.5, 0, 0);
  part.rotation.y = 0.8;
  parent.add(part);
  parent.updateMatrixWorld(true);
  return { parent, part, anchor: new Vector3(-0.5, 0, 0) };
}

describe('movedAnchor', () => {
  it('uses the new position in the same update', () => {
    const { part, anchor } = pivotedPart();
    const newPosition = new Vector3(2, 1, 0.3);
    const actual = movedAnchor(part, newPosition, anchor);
    expectVector(actual, part.localToWorld(anchor.clone()));
    expectUnchanged(anchor, new Vector3(-0.5, 0, 0), 'anchor');
    expectUnchanged(newPosition, new Vector3(2, 1, 0.3), 'newPosition');
  });

  it('also refreshes a parent moved in the same update', () => {
    const { parent, part, anchor } = pivotedPart();
    parent.position.set(-3, 2, 4);
    const actual = movedAnchor(part, new Vector3(0.8, 0.5, 0), anchor);
    expectVector(actual, part.localToWorld(anchor.clone()));
  });
});
