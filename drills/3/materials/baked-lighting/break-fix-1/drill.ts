import {MeshStandardMaterial,Texture} from 'three';
export function attachCreviceAo(material:MeshStandardMaterial,ao:Texture):MeshStandardMaterial {
 ao.channel=0;material.aoMap=ao;return material;
}
