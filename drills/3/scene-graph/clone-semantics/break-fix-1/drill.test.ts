import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { variant } from './drill';

describe('scene-graph.clone-semantics', () => {
  it('repairs the reported symptom for a general case', () => {
    const original=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({color:0xff0000})); const clone=variant(original);
    (clone.material as THREE.MeshBasicMaterial).color.set(0x00ff00);
    expect((original.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0xff0000);
    expect(clone.geometry).toBe(original.geometry);
  });
});
