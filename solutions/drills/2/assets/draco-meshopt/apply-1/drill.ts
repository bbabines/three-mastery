// Asset formats: compare decode and VRAM. Write the functions, save, and run: npm run drill -- drills/2/assets/draco-meshopt/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The chosen codec from measured decode and payload costs.
export function chooseGeometryCodec(dracoBytes: number, dracoDecodeMs: number, meshoptBytes: number, meshoptDecodeMs: number, maxDecodeMs: number): Answer<'draco' | 'meshopt'> {
  if (meshoptDecodeMs <= maxDecodeMs && dracoDecodeMs > maxDecodeMs) return 'meshopt';
  return dracoBytes <= meshoptBytes ? 'draco' : 'meshopt';
}

// Approximate raw RGBA bytes; compressed KTX2 may use less.
export function rgbaTextureBytes(width: number, height: number, mipmaps: boolean): Answer<number> {
  let bytes = 0;
  while (true) { bytes += width * height * 4; if (!mipmaps || (width === 1 && height === 1)) break; width = Math.max(1, Math.floor(width / 2)); height = Math.max(1, Math.floor(height / 2)); }
  return bytes;
}
