import {expect} from 'vitest';
import {Matrix3,Matrix4,Vector3} from 'three';
import type {worldNormal} from './drill';
export function checkRepair(repair:typeof worldNormal):void {
 const n=new Vector3(0,1,0),model=new Matrix4().makeRotationZ(.5),view=new Matrix4().makeRotationX(.8);
 expect(repair(n,model,view).distanceTo(n.clone().applyMatrix3(new Matrix3().getNormalMatrix(model)).normalize())).toBeLessThan(1e-8);
}
