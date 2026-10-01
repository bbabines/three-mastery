import {describe,expect,it} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import {softRing} from './drill';
describe('softRing',()=>{
 it('renders the repaired effect at multiple samples',()=>{
  const material=softRing();const edge=shaderPixel(material,50,32)[0],center=shaderPixel(material,32,32)[0];expect(edge).toBeGreaterThan(20);expect(edge).toBeLessThan(220);expect(center).toBeLessThan(20);material.dispose();
 });
});
