import { answered } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { moveInterleavedVertex } from './drill';

describe('geometry.interleaved', () => {
  it('move a vertex in an interleaved position attribute by vertex number, then mark its shared buffer for upload', () => {
    const data=new THREE.InterleavedBuffer(new Float32Array([0,0,0, 0.2,0.3, 1,1,1, 0.4,0.5]),5);
    const position=new THREE.InterleavedBufferAttribute(data,3,0); const uv=new THREE.InterleavedBufferAttribute(data,2,3);
    const before=data.version; expect(answered(moveInterleavedVertex(position,1,new THREE.Vector3(2,3,4)))).toBe(true);
    expect(new THREE.Vector3(position.getX(1),position.getY(1),position.getZ(1)).distanceTo(new THREE.Vector3(2,3,4))).toBeLessThan(1e-6);
    expect(uv.getX(1)).toBeCloseTo(0.4); expect(data.version).toBeGreaterThan(before);
  });
});
