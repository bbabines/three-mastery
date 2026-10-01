// Triage: trace a wrong color. Write the functions, save, and run: npm run drill -- drills/2/debugging/triage/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The first color setup area to inspect.
export function colorFaultArea(material: THREE.MeshStandardMaterial, outputColorSpace: string): Answer<'material' | 'pipeline' | 'ready'> {
  return null;
}
