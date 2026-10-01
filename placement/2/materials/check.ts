import type { Answer } from '@harness/drill';
import { Vector3, type ColorSpace, type Material, type Scene, type Texture, type ToneMapping } from 'three';
// Choose a material family for a lit or unlit label.
export function unlitType(lit: boolean): Answer<"basic" | "standard"> {
 return null;
}

// Whether RectAreaLight can light this material.
export function areaLit(material: Material): Answer<boolean> {
 return null;
}

// The texture color space for this map channel.
export function mapSpace(kind: "color" | "normal" | "roughness"): Answer<ColorSpace> {
 return null;
}

// The tone mapping that keeps product colors close to source.
export function productTone(): Answer<ToneMapping> {
 return null;
}

// Clamped Lambert cosine for arbitrary-length vectors.
export function diffuseCosine(normal: Vector3, toLight: Vector3): Answer<number> {
 return null;
}

// Normalized Blinn half vector.
export function halfVector(toLight: Vector3, toView: Vector3): Answer<Vector3> {
 return null;
}

// Metalness for bare metal or paint over metal.
export function finishMetalness(finish: "bare" | "paint"): Answer<number> {
 return null;
}

// Point-source intensity at distance, inverse-square.
export function pointIrradiance(power: number, distance: number): Answer<number> {
 return null;
}

// Set an environment light without changing the backdrop.
export function addEnvironment(scene: Scene, texture: Texture): Answer<Scene> {
 return null;
}

// Directional shadow-map texel density.
export function shadowTexelsPerUnit(mapSize: number, frustumWidth: number): Answer<number> {
 return null;
}

// Choose the second UV set for a baked AO map.
export function useSecondUv(ao: Texture): Answer<Texture> {
 return null;
}

// Set mipmapped minification for a distant tiling texture.
export function mipFilter(texture: Texture): Answer<Texture> {
 return null;
}

// Read roughness and metalness from an ORM pixel.
export function unpackOrm(pixel: Vector3): Answer<{roughness:number; metalness:number}> {
 return null;
}

// Set front-face rendering for a one-sided panel.
export function oneSided(material: Material): Answer<Material> {
 return null;
}
