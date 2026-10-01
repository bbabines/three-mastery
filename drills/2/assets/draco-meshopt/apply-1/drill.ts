// Asset formats: compare decode and VRAM. Write the functions, save, and run: npm run drill -- drills/2/assets/draco-meshopt/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The chosen codec from measured decode and payload costs.
export function chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number): Answer<'draco' | 'meshopt'> {
  return null;
}

// Approximate raw RGBA bytes; compressed KTX2 may use less.
export function rgbaTextureBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  return null;
}
