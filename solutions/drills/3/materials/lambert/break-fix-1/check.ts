import type { matteLight } from './drill';
import { expect } from 'vitest';
import { Vector3 } from 'three';
export function checkRepair(repair: typeof matteLight): void {
 const n=new Vector3(0,2,0),l=new Vector3(3,4,0);expect(repair(n,l,new Vector3(4,1,0))).toBeCloseTo(repair(n,l,new Vector3(0,1,0)));
}
