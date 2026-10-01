import {expect} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import type {softRing} from './drill';
export function checkRepair(repair:typeof softRing):void {
 const material=repair();const edge=shaderPixel(material,50,32)[0];expect(edge).toBeGreaterThan(20);expect(edge).toBeLessThan(220);material.dispose();
}
