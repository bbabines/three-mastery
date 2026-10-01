import type { Answer } from '@harness/drill';
import { DoubleSide, FrontSide, LinearMipmapLinearFilter, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, NeutralToneMapping, NoColorSpace, Scene, SRGBColorSpace, Texture, Vector3, type ColorSpace, type Material, type ToneMapping } from 'three';
export function unlitType(lit: boolean): Answer<"basic" | "standard"> {
 return lit ? "standard" : "basic";
}

export function areaLit(material: Material): Answer<boolean> {
 return material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial;
}

export function mapSpace(kind: "color" | "normal" | "roughness"): Answer<ColorSpace> {
 return kind === "color" ? SRGBColorSpace : NoColorSpace;
}

export function productTone(): Answer<ToneMapping> {
 return NeutralToneMapping;
}

export function diffuseCosine(normal: Vector3, toLight: Vector3): Answer<number> {
 return Math.max(0, normal.clone().normalize().dot(toLight.clone().normalize()));
}

export function halfVector(toLight: Vector3, toView: Vector3): Answer<Vector3> {
 return toLight.clone().normalize().add(toView.clone().normalize()).normalize();
}

export function finishMetalness(finish: "bare" | "paint"): Answer<number> {
 return finish === "bare" ? 1 : 0;
}

export function pointIrradiance(power: number, distance: number): Answer<number> {
 return power / (4 * Math.PI * distance * distance);
}

export function addEnvironment(scene: Scene, texture: Texture): Answer<Scene> {
 scene.environment = texture; return scene;
}

export function shadowTexelsPerUnit(mapSize: number, frustumWidth: number): Answer<number> {
 return mapSize / frustumWidth;
}

export function useSecondUv(ao: Texture): Answer<Texture> {
 ao.channel = 1; return ao;
}

export function mipFilter(texture: Texture): Answer<Texture> {
 texture.generateMipmaps = true; texture.minFilter = LinearMipmapLinearFilter; return texture;
}

export function unpackOrm(pixel: Vector3): Answer<{roughness:number; metalness:number}> {
 return {roughness: pixel.y, metalness: pixel.z};
}

export function oneSided(material: Material): Answer<Material> {
 material.side = FrontSide; return material;
}
