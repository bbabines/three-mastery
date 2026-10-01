import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { preuploadTexture } from './drill';

describe('preuploadTexture', () => {
it('asks the renderer to upload exactly the supplied texture', () => {
    const texture = new THREE.Texture(); const calls: THREE.Texture[] = [];
    const renderer = { initTexture: (item: THREE.Texture) => { calls.push(item); } } as Pick<THREE.WebGLRenderer, 'initTexture'>;
    expect(answered(preuploadTexture(renderer,texture))).toBe(texture);
    expect(calls).toEqual([texture]);
  });
});
