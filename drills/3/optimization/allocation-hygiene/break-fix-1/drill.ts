import { Color, DataTexture, MeshBasicMaterial, RGBAFormat } from 'three';
export function updateVariant(material: MeshBasicMaterial, color: Color, scratch: Uint8Array): void {
  material.map = new DataTexture(new Uint8Array([Math.round(color.r*255),Math.round(color.g*255),Math.round(color.b*255),255]),1,1,RGBAFormat);
  material.map.needsUpdate=true;
  material.needsUpdate=true;
}
