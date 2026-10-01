import {DoubleSide,FrontSide,MeshBasicMaterial,Texture} from 'three';
export function perforatedPanel(mask:Texture):MeshBasicMaterial {
 return new MeshBasicMaterial({alphaMap:mask,side:DoubleSide,transparent:true,depthWrite:false});
}
