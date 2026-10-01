import {describe,expect,it} from 'vitest';
import {Vector2,Vector3} from 'three';
import {roughMetal} from './drill';
describe('roughMetal',()=>{it('repairs the effect across inputs',()=>{ expect(roughMetal(new Vector3(.1,.8,.3)).equals(new Vector2(.8,.3))).toBe(true);expect(roughMetal(new Vector3(.2,.4,.9)).x).toBe(.4); });});
