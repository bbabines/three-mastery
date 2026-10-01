// No docs. Write each small judgment check, then run npm run pick -- done once.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// loaders-tour: Recognize a texture that should be treated as display color.
export function colorTexture(texture: THREE.Texture): Answer<boolean> {
  return null;
}

// gltf-structure: Find a named mesh inside a loaded scene.
export function namedMesh(root: THREE.Object3D, name: string): Answer<THREE.Mesh | undefined> {
  return null;
}

// load-lifecycle: Check whether texture source data has arrived.
export function hasTextureData(texture: THREE.Texture): Answer<boolean> {
  return null;
}

// decode-upload-compile: Decide whether first visible use can still hitch.
export function needsFirstUseWarmup(decoded: boolean, uploaded: boolean, compiled: boolean): Answer<boolean> {
  return null;
}

// draco-meshopt: Choose an available compressed-mesh decoder.
export function decoderChoice(dracoAvailable: boolean, meshoptAvailable: boolean): Answer<'meshopt' | 'draco' | 'none'> {
  return null;
}

// ktx2: Recognize a GPU-compressed texture object.
export function isGpuCompressed(texture: THREE.Texture): Answer<boolean> {
  return null;
}

// memory-math: Estimate RGBA8 texture bytes across mip levels.
export function rgbaBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  return null;
}

// reuse-caching: Check whether two parts reuse one geometry.
export function sharesGeometry(a: THREE.Mesh, b: THREE.Mesh): Answer<boolean> {
  return null;
}

// disposal: Dispose a material only when this viewer owns it.
export function disposeIfOwned(material: THREE.Material, owned: Set<THREE.Material>): Answer<boolean> {
  return null;
}

// preload-lazy: Preload an asset only if near use and within memory budget.
export function shouldPreload(soon: boolean, bytes: number, availableBytes: number): Answer<boolean> {
  return null;
}
