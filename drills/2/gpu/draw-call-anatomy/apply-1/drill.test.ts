import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { renderCallCount } from './drill';

describe('renderCallCount', () => {
it('reads renderer.info after the render it measures', () => {
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(); let rendered=false;
    const renderer = {render: () => {rendered=true;}, info: {render:{calls:3}}} as unknown as Pick<THREE.WebGLRenderer,'render'|'info'>;
    expectNumber(renderCallCount(renderer,scene,camera),3); expect(rendered).toBe(true);
  });
});
