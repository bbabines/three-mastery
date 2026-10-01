import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveByWorld } from './drill';

describe('interaction.local-world-manipulation', () => {
  it('repairs the reported symptom for a general case', () => {
    const parent=new THREE.Group(),part=new THREE.Object3D(); parent.rotation.y=0.7; parent.position.set(2,0,1); parent.add(part); part.position.set(1,0,0);
    const before=part.getWorldPosition(new THREE.Vector3()), delta=new THREE.Vector3(2,0,0); const got=moveByWorld(part,delta);
    expect(got.distanceTo(before.add(delta))).toBeLessThan(1e-6);
  });
});
