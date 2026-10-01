import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { boundsInWorld } from './drill';

describe('scene-graph.world-bounds', () => {
  it('repairs the reported symptom for a general case', () => {
    const parent=new THREE.Group(), part=new THREE.Mesh(new THREE.BoxGeometry(2,1,1));
    const child=new THREE.Mesh(new THREE.BoxGeometry(0.5,3,0.5));
    child.position.set(0,2,0); part.add(child);
    parent.position.set(4,1,2); parent.rotation.y=0.7; parent.add(part);
    const got=boundsInWorld(part); parent.updateWorldMatrix(true,true);
    const expected=new THREE.Box3().setFromObject(part,true);
    expect(got.min.distanceTo(expected.min)).toBeLessThan(1e-6); expect(got.max.distanceTo(expected.max)).toBeLessThan(1e-6);
  });
});
