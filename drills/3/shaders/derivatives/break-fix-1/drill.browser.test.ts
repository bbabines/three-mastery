import {describe,expect,it} from 'vitest';
import {shaderPixel} from '../../probe';
import {gridShader} from './drill';
describe('gridShader',()=>{
 it('keeps a partly covered line at two device resolutions',()=>{
  const material=gridShader();
  for(const [x,y,size] of [[8,32,64],[16,64,128]]){
   const red=shaderPixel(material,x,y,size)[0];expect(red).toBeGreaterThan(25);expect(red).toBeLessThan(230);
  }
  material.dispose();
 });
});
