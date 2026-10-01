import { Box3, Camera, Frustum, Matrix4, Material, Mesh, Vector3 } from 'three';
export function configurePart(mesh:Mesh,camera:Camera,nearMaterial:Material,farMaterial:Material,farDistance:number):'culled'|'near'|'far'{
 camera.updateMatrixWorld();mesh.updateWorldMatrix(true,false);
 const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 const visible=frustum.intersectsBox(new Box3().setFromObject(mesh));mesh.visible=visible;
 if(!visible)return 'culled';
 const distance=mesh.getWorldPosition(new Vector3()).distanceTo(camera.getWorldPosition(new Vector3()));
 const far=distance>=farDistance;mesh.material=far?farMaterial:nearMaterial;
 return far?'far':'near';
}
