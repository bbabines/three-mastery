import {expect} from 'vitest';
import {Vector2,Vector3} from 'three';
import type {roughMetal} from './drill';
export function checkRepair(repair:typeof roughMetal):void {

 expect(repair(new Vector3(.1,.8,.3)).equals(new Vector2(.8,.3))).toBe(true);
}
