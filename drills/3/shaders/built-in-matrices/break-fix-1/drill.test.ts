import {describe,expect,it} from 'vitest';
import {Matrix3,Matrix4,Vector3} from 'three';
import {worldNormal} from './drill';
describe('worldNormal',()=>{it('repairs the effect across inputs',()=>{ const n=new Vector3(0,1,0),model=new Matrix4().makeRotationZ(.5),view=new Matrix4().makeRotationX(.8),expected=n.clone().applyMatrix3(new Matrix3().getNormalMatrix(model)).normalize();expect(worldNormal(n,model,view).distanceTo(expected)).toBeLessThan(1e-8);expect(worldNormal(n,model,new Matrix4()).distanceTo(expected)).toBeLessThan(1e-8);expect(n.equals(new Vector3(0,1,0))).toBe(true); });});
