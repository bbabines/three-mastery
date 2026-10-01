import {describe,expect,it} from 'vitest';
import {Vector3} from 'three';
import {shaderPixel} from '../../probe';
import {normalDebug} from './drill';
describe('normalDebug',()=>{
 it('renders the repaired effect at multiple samples',()=>{
  const mat=normalDebug(new Vector3(-1,0,0));const pixel=shaderPixel(mat,32,32);expect(pixel[0]).toBeLessThan(5);expect(pixel[1]).toBeGreaterThan(100);expect(pixel[2]).toBeGreaterThan(100);mat.dispose();const second=normalDebug(new Vector3(0,2,0));expect(shaderPixel(second,32,32)[1]).toBeGreaterThan(245);second.dispose();
 });
});
