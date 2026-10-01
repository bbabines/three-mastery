import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { uvAtPoint } from './drill';

describe('uvAtPoint', () => {
it('blends UVs inside a sloped triangle without changing them', () => {
    const a = new THREE.Vector3(0, 0, 0), b = new THREE.Vector3(2, 0, 1), c = new THREE.Vector3(0, 2, 1);
    const point = a.clone().multiplyScalar(0.2).addScaledVector(b, 0.3).addScaledVector(c, 0.5);
    const uvs = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1)];
    const before = [point.clone(),a.clone(),b.clone(),c.clone()];
    const beforeUvs = uvs.map((uv) => uv.clone());
    const result = answered(uvAtPoint(point, a, b, c, uvs[0], uvs[1], uvs[2]));
    expect(result.x).toBeCloseTo(0.3); expect(result.y).toBeCloseTo(0.5);
    expect(uvs[0].toArray()).toEqual([0, 0]); expect(point.toArray()).toEqual([0.6, 1, 0.8]);
    for (const [index, input] of [point,a,b,c].entries()) expectUnchanged(input, before[index], 'triangle input');
    for (const [index, uv] of uvs.entries()) expect(uv).toEqual(beforeUvs[index]);
  });
});
