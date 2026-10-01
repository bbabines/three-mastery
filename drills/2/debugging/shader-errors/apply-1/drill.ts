// Shader errors: read the log and try debug views. Write the functions, save, and run: npm run drill -- drills/2/debugging/shader-errors/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The authored shader line, or −1 when the log has no line.
export function authoredShaderLine(log: string, injectedLines: number): Answer<number> {
  return null;
}

// A material that reveals normals, depth, or mesh edges.
export function debugViewMaterial(view: "normal" | "depth" | "wireframe"): Answer<THREE.Material> {
  return null;
}
