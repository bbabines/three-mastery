import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveInterleaved } from './drill';

describe('geometry.interleaved', () => {
  it('repairs the reported symptom for a general case', () => {
    const data=new THREE.InterleavedBuffer(new Float32Array([0,0,0, 0.1,0.2, 1,1,1, 0.3,0.4]),5);
    const pos=new THREE.InterleavedBufferAttribute(data,3,0), uv=new THREE.InterleavedBufferAttribute(data,2,3), before=data.version;
    expect(moveInterleaved(pos,1,new THREE.Vector3(2,3,4))).toBe(true);
    expect(new THREE.Vector3(pos.getX(1),pos.getY(1),pos.getZ(1)).distanceTo(new THREE.Vector3(2,3,4))).toBeLessThan(1e-6);
    expect(uv.getX(1)).toBeCloseTo(0.3); expect(data.version).toBeGreaterThan(before);
  });
});
