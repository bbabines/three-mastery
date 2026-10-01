import type { inspectionMaterial } from './drill';
import { expect } from 'vitest';
import { MeshNormalMaterial } from 'three';
export function checkRepair(repair: typeof inspectionMaterial): void {
 expect(repair('normals')).toBeInstanceOf(MeshNormalMaterial);
}
