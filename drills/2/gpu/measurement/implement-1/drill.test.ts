import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { cpuRenderMs } from './drill';

describe('cpuRenderMs', () => {
it('times around the render call in the right order', () => {
    const events: string[] = []; const times = [10,13.5];
    const now = () => {events.push('clock'); return times.shift()!;};
    const renderer = {render: () => {events.push('render');}} as Pick<THREE.WebGLRenderer,'render'>;
    expectNumber(cpuRenderMs(renderer,new THREE.Scene(),new THREE.PerspectiveCamera(),now),3.5);
    expect(events).toEqual(['clock','render','clock']);
  });
});
