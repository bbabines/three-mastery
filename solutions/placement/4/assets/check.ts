import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function colorTexture(texture: THREE.Texture): Answer<boolean> {
  return texture.colorSpace===THREE.SRGBColorSpace;
}

export function namedMesh(root: THREE.Object3D, name: string): Answer<THREE.Mesh | undefined> {
  const object=root.getObjectByName(name); return object instanceof THREE.Mesh ? object : undefined;
}

export function hasTextureData(texture: THREE.Texture): Answer<boolean> {
  return texture.source.data != null;
}

export function needsFirstUseWarmup(decoded: boolean, uploaded: boolean, compiled: boolean): Answer<boolean> {
  return !decoded || !uploaded || !compiled;
}

export function decoderChoice(dracoAvailable: boolean, meshoptAvailable: boolean): Answer<'meshopt' | 'draco' | 'none'> {
  return meshoptAvailable ? 'meshopt' : dracoAvailable ? 'draco' : 'none';
}

export function isGpuCompressed(texture: THREE.Texture): Answer<boolean> {
  return texture instanceof THREE.CompressedTexture;
}

export function rgbaBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  let bytes=0; for(let w=width,h=height;;w=Math.max(1,Math.floor(w/2)),h=Math.max(1,Math.floor(h/2))){bytes+=w*h*4;if(!mipmaps||(w===1&&h===1))break;} return bytes;
}

export function sharesGeometry(a: THREE.Mesh, b: THREE.Mesh): Answer<boolean> {
  return a.geometry===b.geometry;
}

export function disposeIfOwned(material: THREE.Material, owned: Set<THREE.Material>): Answer<boolean> {
  if(!owned.has(material))return false; material.dispose(); return true;
}

export function shouldPreload(soon: boolean, bytes: number, availableBytes: number): Answer<boolean> {
  return soon && bytes<=availableBytes;
}
