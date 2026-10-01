import {expect} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import type {normalDebug} from './drill';
export function checkRepair(repair:typeof normalDebug):void {
 const material=repair(new Vector3(-1,0,0));const pixel=shaderPixel(material,32,32);expect(pixel[1]).toBeGreaterThan(100);material.dispose();
}
