import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// 'Tour: loaders and textures': Whether a Draco decoder must be attached.
export function needsDraco(extensions: string[]): Answer<boolean> {
  return null;
}

// glTF structure: The number of glTF primitives for one mesh index.
export function primitiveCount(document: { meshes: { primitives: unknown[] }[] }, meshIndex: number): Answer<number> {
  return null;
}

// Load lifecycle: The current async load state.
export function loadState(completed: boolean, failed: boolean): Answer<'loading' | 'ready' | 'failed'> {
  return null;
}

// Decode, upload, compile: The same texture after requesting an early GPU upload.
export function preuploadTexture(renderer: Pick<THREE.WebGLRenderer, "initTexture">, texture: THREE.Texture): Answer<THREE.Texture> {
  return null;
}

// Draco vs Meshopt: The chosen codec from measured decode and payload costs.
export function chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number): Answer<'draco' | 'meshopt'> {
  return null;
}

// KTX2 and Basis textures: Approximate raw RGBA bytes; compressed KTX2 may use less.
export function rgbaTextureBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  return null;
}

// Runtime memory math: The total bytes of unique attribute and index arrays.
export function geometryArrayBytes(geometry: THREE.BufferGeometry): Answer<number> {
  return null;
}

// Reuse and caching: The cached Promise for that URL.
export function cachedLoad(url: string, cache: Map<string, Promise<string>>, load: (url: string) => Promise<string>): Answer<Promise<string>> {
  return null;
}

// Disposal ownership: The number of unique owned resources disposed.
export function disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>): Answer<number> {
  return null;
}

// Preload vs lazy load: The first likely asset within the remaining byte budget.
export function nextPreload(items: { url: string; likely: boolean; bytes: number }[], budgetBytes: number): Answer<string> {
  return null;
}
