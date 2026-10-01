import { NoColorSpace, RepeatWrapping, SRGBColorSpace, Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { markMaps } from './drill';
describe('markMaps',()=>{
 it('decodes color while leaving normal data unconverted',()=>{const color=new Texture(),normal=new Texture();const result=markMaps(color,normal);expect(result).toEqual({color,normal});expect(color.colorSpace).toBe(SRGBColorSpace);expect(normal.colorSpace).toBe(NoColorSpace);});
 it('preserves unrelated map settings',()=>{const color=new Texture(),normal=new Texture();normal.wrapS=RepeatWrapping;markMaps(color,normal);expect(normal.wrapS).toBe(RepeatWrapping);});
});
