import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { swingDoor } from './drill';

describe('transforms.pivots', () => {
  it('swing a point on a door around its hinge instead of around the scene origin, keeping the input points intact', () => {
    const hinge=new THREE.Vector3(3,0,-2), point=new THREE.Vector3(4,1,-2), before=point.clone();
    for (const angle of [0,Math.PI/2,-Math.PI/3]) {
      const expected=point.clone().sub(hinge).applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),angle)).add(hinge);
      expect(answered(swingDoor(hinge,point,angle)).distanceTo(expected)).toBeLessThan(1e-6);
    }
    expect(point.equals(before)).toBe(true);
  });
});
