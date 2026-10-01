import { describe, expect, it } from 'vitest';
import { Color, DataTexture, MeshBasicMaterial, RGBAFormat } from 'three';
import { updateVariant } from './drill';
describe('variant colors',()=>{
 it('changes bytes without replacing the GPU texture or allocating each update',()=>{
  const map=new DataTexture(new Uint8Array(4),1,1,RGBAFormat), material=new MeshBasicMaterial({map});
  const pixels=map.image.data as Uint8Array,scratch=new Uint8Array(4);
  for(const color of [new Color(1,0,0),new Color(0,0.5,1),new Color(0.2,0.3,0.4)]){
   updateVariant(material,color,scratch);
   expect(material.map).toBe(map);expect(map.image.data).toBe(pixels);
   expect([...pixels]).toEqual([color.r,color.g,color.b].map(channel=>Math.round(channel*255)).concat(255));
   expect([...scratch]).toEqual([...pixels]);
  }
  map.dispose();material.dispose();
 });
});
