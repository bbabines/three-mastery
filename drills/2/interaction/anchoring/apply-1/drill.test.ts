import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { labelUnoccluded } from './drill';

describe('labelUnoccluded', () => {
it('hides a tag behind a blocker but not one in front of it', () => {
    const camera = new THREE.PerspectiveCamera(); camera.position.set(0,0,5); camera.lookAt(0,0,0); camera.updateMatrixWorld();
    const blocker = new THREE.Mesh(new THREE.BoxGeometry(2,2,0.4)); blocker.position.z=2; blocker.updateMatrixWorld();
    expectExact(labelUnoccluded(new THREE.Vector3(0,0,0),camera,[blocker]),false);
    expectExact(labelUnoccluded(new THREE.Vector3(0,0,3),camera,[blocker]),true);
    expectExact(labelUnoccluded(new THREE.Vector3(0,0,10),camera,[blocker]),false);
  });
});
