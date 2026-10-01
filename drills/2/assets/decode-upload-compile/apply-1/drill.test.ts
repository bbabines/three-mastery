import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { precompileVariant } from './drill';

describe('precompileVariant', () => {
it('passes the scene and camera through and returns the pending work', async () => {
    const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera();
    const calls: unknown[][] = []; const pending = Promise.resolve(scene as THREE.Object3D);
    const renderer = { compileAsync: (s: THREE.Object3D, c: THREE.Camera) => { calls.push([s,c]); return pending; } } as Pick<THREE.WebGLRenderer, 'compileAsync'>;
    const result = answered(precompileVariant(renderer,scene,camera));
    expect(result).toBe(pending); await result; expect(calls).toEqual([[scene,camera]]);
  });
});
