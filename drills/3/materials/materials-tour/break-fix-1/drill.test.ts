import { MeshNormalMaterial, MeshStandardMaterial } from 'three';
import { describe, expect, it } from 'vitest';
import { inspectionMaterial } from './drill';
describe('inspectionMaterial',()=>{
 it('shows normals without lighting in debug mode',()=>expect(inspectionMaterial('normals')).toBeInstanceOf(MeshNormalMaterial));
 it('keeps a physically lit finish in product mode',()=>expect(inspectionMaterial('finish')).toBeInstanceOf(MeshStandardMaterial));
});
