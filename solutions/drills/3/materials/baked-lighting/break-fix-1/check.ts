import { expect } from 'vitest';
import {MeshStandardMaterial,Texture} from 'three';
import type { attachCreviceAo } from './drill';
export function checkRepair(repair: typeof attachCreviceAo): void {
 const ao=new Texture();
 repair(new MeshStandardMaterial(),ao);expect(ao.channel).toBe(1);
}
