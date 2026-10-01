import { Color, DataTexture, MeshBasicMaterial } from 'three';
export function updateVariant(material: MeshBasicMaterial, color: Color, scratch: Uint8Array): void {
  const map=material.map as DataTexture;
  scratch[0]=Math.round(color.r*255);scratch[1]=Math.round(color.g*255);scratch[2]=Math.round(color.b*255);scratch[3]=255;
  (map.image.data as Uint8Array).set(scratch);
  map.needsUpdate=true;
}
