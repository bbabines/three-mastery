import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { dragPosition } from './drill';

describe('interaction.drag-on-plane', () => {
  it('repairs the reported symptom for a general case', () => {
    const hit=new THREE.Vector3(3,0,-2), offset=new THREE.Vector3(-0.5,1,0.3); expect(dragPosition(hit,offset).distanceTo(hit.clone().add(offset))).toBeLessThan(1e-6);
  });
});
