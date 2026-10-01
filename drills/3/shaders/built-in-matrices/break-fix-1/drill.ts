import {Matrix3,Matrix4,Vector3} from 'three';
export function worldNormal(local:Vector3,model:Matrix4,view:Matrix4):Vector3 {
 return local.clone().applyMatrix3(new Matrix3().getNormalMatrix(view.clone().multiply(model))).normalize();
}
