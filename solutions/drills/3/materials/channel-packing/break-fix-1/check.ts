import { expect } from 'vitest';
import {Vector3} from 'three';
import type { readOrm } from './drill';
export function checkRepair(repair: typeof readOrm): void {

 expect(repair(new Vector3(.1,.8,.3)).roughness).toBe(.8);
}
