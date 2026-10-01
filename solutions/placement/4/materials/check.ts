import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function materialForLight(needsLighting: boolean): Answer<THREE.Material> {
  return needsLighting?new THREE.MeshStandardMaterial():new THREE.MeshBasicMaterial();
}

export function setLightStrength(light: THREE.Light, intensity: number): Answer<number> {
  light.intensity=intensity; return light.intensity;
}

export function markColorMap(texture: THREE.Texture): Answer<THREE.Texture> {
  texture.colorSpace=THREE.SRGBColorSpace; return texture;
}

export function exposureChoice(current: number, stops: number): Answer<number> {
  return current*Math.pow(2,stops);
}

export function diffuseFactor(normal: THREE.Vector3, lightDirection: THREE.Vector3): Answer<number> {
  return Math.max(0,normal.clone().normalize().dot(lightDirection.clone().normalize()));
}

export function halfDirection(toLight: THREE.Vector3, toEye: THREE.Vector3): Answer<THREE.Vector3> {
  return toLight.clone().normalize().add(toEye.clone().normalize()).normalize();
}

export function metalNeedsEnvironment(material: THREE.MeshStandardMaterial, scene: THREE.Scene): Answer<boolean> {
  return material.metalness>0&&scene.environment===null;
}

export function shadowCapable(light: THREE.Light): Answer<boolean> {
  return light instanceof THREE.DirectionalLight||light instanceof THREE.PointLight||light instanceof THREE.SpotLight;
}

export function applyEnvironment(scene: THREE.Scene, map: THREE.Texture): Answer<THREE.Texture> {
  scene.environment=map; return map;
}

export function castShadow(light: THREE.Light): Answer<boolean> {
  light.castShadow=true; return light.castShadow;
}

export function attachLightMap(material: THREE.MeshStandardMaterial, map: THREE.Texture): Answer<THREE.Texture> {
  material.lightMap=map; material.needsUpdate=true; return map;
}

export function useMipFiltering(texture: THREE.Texture): Answer<THREE.Texture> {
  texture.minFilter=THREE.LinearMipmapLinearFilter; return texture;
}

export function roughnessByte(rgba: [number,number,number,number]): Answer<number> {
  return rgba[1];
}

export function makeCutout(material: THREE.Material, threshold: number): Answer<number> {
  material.alphaTest=threshold; material.needsUpdate=true; return material.alphaTest;
}
