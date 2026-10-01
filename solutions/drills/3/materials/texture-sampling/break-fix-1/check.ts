import { expect } from 'vitest';
import {LinearMipmapLinearFilter,Texture,RepeatWrapping} from 'three';
import type { distantTile } from './drill';
export function checkRepair(repair: typeof distantTile): void {
 const tex=new Texture();
 repair(tex);expect(tex.minFilter).toBe(LinearMipmapLinearFilter);
}
