import type { ceilingPanel } from './drill';
import { expect } from 'vitest';
import { MeshStandardMaterial } from 'three';
export function checkRepair(repair: typeof ceilingPanel): void {
 expect(repair(2,3).surface).toBeInstanceOf(MeshStandardMaterial);
}
