import type { glint } from './drill';
import { expect } from 'vitest';
import { Vector3 } from 'three';
export function checkRepair(repair: typeof glint): void {
 const n=new Vector3(0,1,0),l=new Vector3(0,1,0);expect(repair(n,l,new Vector3(0,1,0),16)).toBeGreaterThan(repair(n,l,new Vector3(2,1,0),16));
}
