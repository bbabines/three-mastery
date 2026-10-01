import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { focusCenter, focusEase } from './drill';

describe('focusCenter', () => {
it('uses the world box rather than the object origin', () => {
    const root = new THREE.Group(); root.position.set(3,1,-2); const mesh = new THREE.Mesh(new THREE.BoxGeometry(2,2,2)); mesh.position.x=2; root.add(mesh);
    root.updateMatrixWorld(true); expectVector(focusCenter(root),new THREE.Box3().setFromObject(root,true).getCenter(new THREE.Vector3()));
  });
});

describe('focusEase', () => {
it('clamps outside the interval and eases within it', () => {
    expectNumber(focusEase(-1,2),0); expectNumber(focusEase(3,2),1);
    expectNumber(focusEase(0.5,2),THREE.MathUtils.smoothstep(0.5,0,2));
    expect(answered(focusEase(0.5,2))).toBeLessThan(0.25);
  });
});
