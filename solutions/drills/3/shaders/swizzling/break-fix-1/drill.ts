import {Vector2,Vector3} from 'three';
export function roughMetal(orm:Vector3):Vector2 {
 return new Vector2(orm.y,orm.z);
}
