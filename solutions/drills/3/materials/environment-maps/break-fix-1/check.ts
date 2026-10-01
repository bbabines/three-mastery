import { expect } from 'vitest';
import {MeshStandardMaterial,Scene,Texture} from 'three';
import type { chromeStage } from './drill';
export function checkRepair(repair: typeof chromeStage): void {
 const s=new Scene(),light=new Texture();
 expect(repair(s,new MeshStandardMaterial(),light,new Texture()).environment).toBe(light);
}
