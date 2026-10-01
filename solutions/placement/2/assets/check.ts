import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// 'Tour: loaders and textures': Whether a Draco decoder must be attached.
export function needsDraco(extensions: string[]): Answer<boolean> {
  return extensions.includes('KHR_draco_mesh_compression');
}

// glTF structure: The number of glTF primitives for one mesh index.
export function primitiveCount(document: { meshes: { primitives: unknown[] }[] }, meshIndex: number): Answer<number> {
  return document.meshes[meshIndex]?.primitives.length ?? 0;
}

// Load lifecycle: The current async load state.
export function loadState(completed: boolean, failed: boolean): Answer<'loading' | 'ready' | 'failed'> {
  return failed ? 'failed' : completed ? 'ready' : 'loading';
}

// Decode, upload, compile: The same texture after requesting an early GPU upload.
export function preuploadTexture(renderer: Pick<THREE.WebGLRenderer, "initTexture">, texture: THREE.Texture): Answer<THREE.Texture> {
  renderer.initTexture(texture);
  return texture;
}

// Draco vs Meshopt: The chosen codec from measured decode and payload costs.
export function chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number): Answer<'draco' | 'meshopt'> {
  if (meshoptDecodeMs <= maxDecodeMs && dracoDecodeMs > maxDecodeMs) return 'meshopt';
  return dracoBytes <= meshoptBytes ? 'draco' : 'meshopt';
}

// KTX2 and Basis textures: Approximate raw RGBA bytes; compressed KTX2 may use less.
export function rgbaTextureBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  let bytes = 0;
  while (true) { bytes += width * height * 4; if (!mipmaps || (width === 1 && height === 1)) break; width = Math.max(1, Math.floor(width / 2)); height = Math.max(1, Math.floor(height / 2)); }
  return bytes;
}

// Runtime memory math: The total bytes of unique attribute and index arrays.
export function geometryArrayBytes(geometry: THREE.BufferGeometry): Answer<number> {
  const arrays = new Set<ArrayBufferView>();
  if (geometry.index) arrays.add(geometry.index.array);
  for (const attribute of Object.values(geometry.attributes)) arrays.add(attribute instanceof THREE.InterleavedBufferAttribute ? attribute.data.array : attribute.array);
  return [...arrays].reduce((sum, array) => sum + array.byteLength, 0);
}

// Reuse and caching: The cached Promise for that URL.
export function cachedLoad(url: string, cache: Map<string, Promise<string>>, load: (url: string) => Promise<string>): Answer<Promise<string>> {
  let pending = cache.get(url);
  if (!pending) { pending = load(url); cache.set(url, pending); }
  return pending;
}

// Disposal ownership: The number of unique owned resources disposed.
export function disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>): Answer<number> {
  const resources = new Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>([mesh.geometry]);
  for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) { resources.add(material); for (const value of Object.values(material)) if (value instanceof THREE.Texture) resources.add(value); }
  let count = 0; for (const resource of resources) if (!shared.has(resource)) { resource.dispose(); count++; }
  return count;
}

// Preload vs lazy load: The first likely asset within the remaining byte budget.
export function nextPreload(items: { url: string; likely: boolean; bytes: number }[], budgetBytes: number): Answer<string> {
  return items.find((item) => item.likely && item.bytes <= budgetBytes)?.url ?? '';
}
