import type { Answer } from '@harness/drill';
import { MeshStandardMaterial, PointLight, RectAreaLight } from 'three';
export type StudioLights = { softbox: RectAreaLight; fill: PointLight; surface: MeshStandardMaterial };
export function studioLights(width: number, height: number, fillLumens: number): Answer<StudioLights> {
 // Return a softbox and a powered point fill.
 return null;
}
