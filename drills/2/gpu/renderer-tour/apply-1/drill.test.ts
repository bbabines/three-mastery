import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { capRendererDpr, putOverlayLast } from './drill';

describe('capRendererDpr', () => {
it('caps a high DPR but keeps a lower DPR', () => {
    const calls: number[] = []; const renderer = {setPixelRatio: (n: number) => {calls.push(n);}} as Pick<THREE.WebGLRenderer,'setPixelRatio'>;
    expectNumber(capRendererDpr(renderer,3,2),2); expectNumber(capRendererDpr(renderer,1.25,2),1.25);
    expect(calls).toEqual([2,1.25]);
  });
});

describe('putOverlayLast', () => {
it('sets explicit order independently of scene insertion order', () => {
    const overlay = new THREE.Mesh(); expectNumber(putOverlayLast(overlay,9),9); expect(overlay.renderOrder).toBe(9);
  });
});
