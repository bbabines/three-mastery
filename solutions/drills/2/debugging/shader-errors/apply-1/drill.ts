// Shader errors: read the log and try debug views. Write the functions, save, and run: npm run drill -- drills/2/debugging/shader-errors/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The authored shader line, or −1 when the log has no line.
export function authoredShaderLine(log: string, injectedLines: number): Answer<number> {
  const match=log.match(/ERROR:\s*\d+:(\d+)/); return match ? Math.max(1,Number(match[1])-injectedLines) : -1;
}

// A material that reveals normals, depth, or mesh edges.
export function debugViewMaterial(view: "normal" | "depth" | "wireframe"): Answer<THREE.Material> {
  if (view==="normal") return new THREE.MeshNormalMaterial(); if (view==="depth") return new THREE.MeshDepthMaterial(); return new THREE.MeshBasicMaterial({wireframe:true});
}
