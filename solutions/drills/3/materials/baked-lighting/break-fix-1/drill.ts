import {MeshStandardMaterial,Texture} from 'three';
export function attachCreviceAo(material:MeshStandardMaterial,ao:Texture):MeshStandardMaterial {
 ao.channel=1;material.aoMap=ao;return material;
}
