import {expect} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import type {uvGradient} from './drill';
export function checkRepair(repair:typeof uvGradient):void {
 const material=repair();const red=shaderPixel(material,24,32)[0];expect(red).toBeGreaterThan(50);expect(red).toBeLessThan(150);material.dispose();
}
