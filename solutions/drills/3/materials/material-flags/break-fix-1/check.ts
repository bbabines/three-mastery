import { expect } from 'vitest';
import {FrontSide,Texture} from 'three';
import type { perforatedPanel } from './drill';
export function checkRepair(repair: typeof perforatedPanel): void {

 const m=repair(new Texture());expect(m.side).toBe(FrontSide);expect(m.depthWrite).toBe(true);
}
