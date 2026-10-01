import { MeshStandardMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { productFinish } from './drill';
describe('productFinish',()=>{
 it('uses endpoint metalness for all three outer surfaces',()=>{expect(productFinish('steel').metalness).toBe(1);expect(productFinish('coat').metalness).toBe(0);expect(productFinish('rubber').metalness).toBe(0);});
 it('keeps finish roughness separate from metalness',()=>{expect(productFinish('rubber').roughness).toBeGreaterThan(productFinish('steel').roughness);expect(productFinish('coat')).toBeInstanceOf(MeshStandardMaterial);});
});
