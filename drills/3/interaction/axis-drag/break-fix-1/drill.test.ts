import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { railPosition } from './drill';

describe('interaction.axis-drag', () => {
  it('repairs the reported symptom for a general case', () => {
    const start=new THREE.Vector3(1,0,2), motion=new THREE.Vector3(3,1,0), axis=new THREE.Vector3(1,0,1).normalize();
    const got=railPosition(start,motion,axis), delta=got.clone().sub(start);
    expect(delta.clone().projectOnPlane(axis).length()).toBeLessThan(1e-6); expect(delta.dot(axis)).toBeCloseTo(motion.dot(axis),6);
  });
});
