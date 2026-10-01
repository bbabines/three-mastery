// Culling and overdraw: choose cheaper distant pixels. Write the functions, save, and run: npm run drill -- drills/2/optimization/culling-lod/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The detail level selected by distance.
export function lodLevel(distance: number, thresholds: number[]): Answer<number> {
  return null;
}

// The alpha-tested, depth-writing panel material.
export function makeCutout(material: THREE.MeshBasicMaterial, threshold: number): Answer<THREE.MeshBasicMaterial> {
  return null;
}
