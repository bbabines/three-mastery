import {DoubleSide,FrontSide,MeshBasicMaterial,Texture} from 'three';
export function perforatedPanel(mask:Texture):MeshBasicMaterial {
 return new MeshBasicMaterial({alphaMap:mask,side:FrontSide,alphaTest:.5,transparent:false,depthWrite:true});
}
