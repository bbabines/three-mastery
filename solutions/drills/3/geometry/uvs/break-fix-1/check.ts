import * as THREE from 'three';
import { expect } from 'vitest';
import type { tileFirstFace } from './drill';

export function checkUvs(subject: typeof tileFirstFace): void {
  const g=new THREE.PlaneGeometry(2,2,2,2), before=g.getAttribute('uv').getY(1); const copy=subject(g,new THREE.Vector2(-0.5,1));
  expect(copy.getAttribute('uv').getY(1)).toBeCloseTo(before+1);
  expect(copy.groups[0]).toEqual({start:0,count:3,materialIndex:1});
}
