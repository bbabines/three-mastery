import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveByWorld } from './drill';

describe('interaction.local-world-manipulation', () => {
  it('moves the part and returns its new world position under a turned parent', () => {
    const parent=new THREE.Group(),part=new THREE.Object3D(); parent.rotation.y=0.7; parent.position.set(2,0,1); parent.add(part); part.position.set(1,0,0);
    const before=part.getWorldPosition(new THREE.Vector3()), delta=new THREE.Vector3(2,0,0); const got=moveByWorld(part,delta);
    const expected=before.add(delta);
    expect(got.distanceTo(expected)).toBeLessThan(1e-6);
    expect(part.getWorldPosition(new THREE.Vector3()).distanceTo(expected)).toBeLessThan(1e-6);
  });
});
