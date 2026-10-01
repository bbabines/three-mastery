import type { Answer } from '@harness/drill';
import { MeshStandardMaterial, PointLight, RectAreaLight, Vector3 } from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
export type StudioLights = { softbox: RectAreaLight; fill: PointLight; surface: MeshStandardMaterial };
export function studioLights(width: number, height: number, fillLumens: number): Answer<StudioLights> {
 RectAreaLightUniformsLib.init();
 const softbox = new RectAreaLight(0xffffff, 5, width, height);
 softbox.position.set(0, 2, 1);
 softbox.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), softbox.position.clone().negate().normalize());
 const fill = new PointLight(0xffffff, 1); fill.power = fillLumens;
 fill.position.set(-1, 1, 1);
 return { softbox, fill, surface: new MeshStandardMaterial({ color: '#c7823a', roughness: .45 }) };
}
