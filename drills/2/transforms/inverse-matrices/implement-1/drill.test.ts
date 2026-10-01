import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointInPart } from './drill';

describe('transforms.inverse-matrices', () => {
  it('map a hit point in world space back into a nested part’s local space without moving the part or point', () => {
    const parent = new THREE.Group(), part = new THREE.Object3D(); parent.add(part); parent.position.set(3,1,-2); parent.rotation.y=0.8; part.scale.set(2,1,0.5);
    const local = new THREE.Vector3(0.4,1,2), world = part.localToWorld(local.clone()), before = world.clone();
    const parentPosition = parent.position.clone(), parentTurn = parent.quaternion.clone(), partScale = part.scale.clone();
    expect(answered(pointInPart(part,world)).distanceTo(local)).toBeLessThan(1e-6);
    expect(world.equals(before)).toBe(true);
    expect(parent.position.equals(parentPosition) && parent.quaternion.equals(parentTurn) && part.scale.equals(partScale)).toBe(true);
  });
});
