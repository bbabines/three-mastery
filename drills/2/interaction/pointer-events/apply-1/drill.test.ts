import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { canvasNdc, wasDrag } from './drill';

describe('canvasNdc', () => {
it('uses the canvas rectangle even when it starts away from the window origin', () => {
    const rect = {left:100,top:50,width:400,height:200}; const point = answered(canvasNdc(200,100,rect));
    expect(point.x).toBeCloseTo(-0.5); expect(point.y).toBeCloseTo(0.5);
  });
});

describe('wasDrag', () => {
it('uses a movement threshold in CSS pixels', () => {
    const down = new THREE.Vector2(100,100);
    expectExact(wasDrag(down,new THREE.Vector2(103,104),5),false);
    expectExact(wasDrag(down,new THREE.Vector2(106,105),5),true);
    expect(down.toArray()).toEqual([100,100]);
  });
});
