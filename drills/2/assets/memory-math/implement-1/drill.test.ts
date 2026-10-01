import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { geometryArrayBytes } from './drill';

describe('geometryArrayBytes', () => {
it('counts interleaved storage once and includes the index', () => {
    const geometry = new THREE.BufferGeometry(); const data = new THREE.InterleavedBuffer(new Float32Array(12),6);
    geometry.setAttribute('position', new THREE.InterleavedBufferAttribute(data,3,0));
    geometry.setAttribute('normal', new THREE.InterleavedBufferAttribute(data,3,3));
    geometry.setIndex([0,1,2]);
    const expected = data.array.byteLength + geometry.index!.array.byteLength;
    expectNumber(geometryArrayBytes(geometry), expected);
  });
});
