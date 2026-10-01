import type { markMaps } from './drill';
import { expect } from 'vitest';
import { NoColorSpace, Texture } from 'three';
export function checkRepair(repair: typeof markMaps): void {
 const normal=new Texture();repair(new Texture(),normal);expect(normal.colorSpace).toBe(NoColorSpace);
}
