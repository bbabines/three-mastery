import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { gizmoWorldAxis } from './drill';

describe('gizmoWorldAxis', () => {
it('changes local axes with a rotated parent but keeps world axes fixed', () => {
    const parent = new THREE.Group(); parent.rotation.y = 0.5; const object = new THREE.Group(); object.rotation.z=0.4; parent.add(object);
    const axis = new THREE.Vector3(2,0,0); const before=axis.clone();
    expectVector(gizmoWorldAxis(object,axis,'local'),axis.clone().normalize().applyQuaternion(object.getWorldQuaternion(new THREE.Quaternion())));
    expectVector(gizmoWorldAxis(object,axis,'world'),new THREE.Vector3(1,0,0)); expectUnchanged(axis,before,'axis');
  });
});
