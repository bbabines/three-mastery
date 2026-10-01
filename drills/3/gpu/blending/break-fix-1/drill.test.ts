import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { prepareGlass } from './drill';

describe('gpu.blending', () => {
  it('repairs the reported symptom for a general case', () => {
    const glass=prepareGlass(new THREE.MeshBasicMaterial(),0.4); expect(glass.transparent).toBe(true); expect(glass.opacity).toBe(0.4); expect(glass.depthTest).toBe(true); expect(glass.depthWrite).toBe(false);
  });
});
