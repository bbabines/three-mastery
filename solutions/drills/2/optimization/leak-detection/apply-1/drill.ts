// Leak check: flag steady memory growth. Write the functions, save, and run: npm run drill -- drills/2/optimization/leak-detection/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Whether GPU resource counts finish above their starting baseline.
export function memoryGrew(samples: { geometries: number; textures: number }[]): Answer<boolean> {
  if(samples.length<2)return false; const first=samples[0],last=samples[samples.length-1]; return last.geometries>first.geometries || last.textures>first.textures;
}
