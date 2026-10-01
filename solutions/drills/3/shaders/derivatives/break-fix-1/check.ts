import {expect} from 'vitest';
import {shaderPixel} from '../../probe';
import type {gridShader} from './drill';
export function checkRepair(repair:typeof gridShader):void {
 const material=repair();const red=shaderPixel(material,8,32,64)[0];
 expect(red).toBeGreaterThan(25);expect(red).toBeLessThan(230);material.dispose();
}
