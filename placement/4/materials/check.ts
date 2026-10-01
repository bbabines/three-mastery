// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// materials-tour: Choose a lit material only when lighting is needed.
export function materialForLight(needsLighting: boolean): Answer<THREE.Material> {
  return null;
}

// lights-tour: Set the light's intensity for a comparison.
export function setLightStrength(light: THREE.Light, intensity: number): Answer<number> {
  return null;
}

// color-spaces: Mark a display-color texture as sRGB.
export function markColorMap(texture: THREE.Texture): Answer<THREE.Texture> {
  return null;
}

// tone-mapping: Apply an exposure change measured in stops.
export function exposureChoice(current: number, stops: number): Answer<number> {
  return null;
}

// lambert: Compute clamped diffuse response for normalized directions.
export function diffuseFactor(normal: THREE.Vector3, lightDirection: THREE.Vector3): Answer<number> {
  return null;
}

// specular: Find the half direction between light and view.
export function halfDirection(toLight: THREE.Vector3, toEye: THREE.Vector3): Answer<THREE.Vector3> {
  return null;
}

// pbr: Judge whether a metal finish lacks reflections.
export function metalNeedsEnvironment(material: THREE.MeshStandardMaterial, scene: THREE.Scene): Answer<boolean> {
  return null;
}

// light-types: Judge whether a light type can cast shadows.
export function shadowCapable(light: THREE.Light): Answer<boolean> {
  return null;
}

// environment-maps: Set an environment map independently of the background.
export function applyEnvironment(scene: THREE.Scene, map: THREE.Texture): Answer<THREE.Texture> {
  return null;
}

// shadows: Enable a light to cast shadows.
export function castShadow(light: THREE.Light): Answer<boolean> {
  return null;
}

// baked-lighting: Attach a baked light map to a material.
export function attachLightMap(material: THREE.MeshStandardMaterial, map: THREE.Texture): Answer<THREE.Texture> {
  return null;
}

// texture-sampling: Choose trilinear minification for a mipmapped texture.
export function useMipFiltering(texture: THREE.Texture): Answer<THREE.Texture> {
  return null;
}

// channel-packing: Read roughness from the green channel of a packed map.
export function roughnessByte(rgba: [number,number,number,number]): Answer<number> {
  return null;
}

// material-flags: Turn on alpha testing for a cutout material.
export function makeCutout(material: THREE.Material, threshold: number): Answer<number> {
  return null;
}
