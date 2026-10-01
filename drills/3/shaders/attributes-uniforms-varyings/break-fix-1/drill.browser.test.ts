import {describe,expect,it} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import {uvGradient} from './drill';
describe('uvGradient',()=>{
 it('renders the repaired effect at multiple samples',()=>{
  const material=uvGradient();const left=shaderPixel(material,24,32)[0],right=shaderPixel(material,40,32)[0];expect(left).toBeGreaterThan(50);expect(left).toBeLessThan(150);expect(right).toBeGreaterThan(left);expect(right).toBeLessThan(220);material.dispose();
 });
});
