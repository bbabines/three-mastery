import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { captureFrameCounts } from './drill';

describe('captureFrameCounts', () => {
it('reads the counters after rendering, not before', () => {
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera();
    const info={render:{calls:0,triangles:0}}; const renderer={render:()=>{info.render.calls=3; info.render.triangles=12;},info} as unknown as Pick<THREE.WebGLRenderer,'render'|'info'>;
    expect(answered(captureFrameCounts(renderer,scene,camera))).toEqual({calls:3,triangles:12});
  });
});
