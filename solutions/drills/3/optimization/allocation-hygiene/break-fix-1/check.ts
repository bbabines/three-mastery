import { expect } from 'vitest';
import { Color, DataTexture, MeshBasicMaterial, RGBAFormat } from 'three';
import type { updateVariant } from './drill';
export function checkVariantReuse(update: typeof updateVariant): void {
 const map=new DataTexture(new Uint8Array(4),1,1,RGBAFormat), material=new MeshBasicMaterial({map}),scratch=new Uint8Array(4);
 for(let i=0;i<20;i++){update(material,new Color(i/20,0.25,1-i/20),scratch);expect(material.map).toBe(map);}
 expect(Array.from(map.image.data as Uint8Array)).toEqual(Array.from(scratch));
 map.dispose();material.dispose();
}
