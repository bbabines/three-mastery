// Triage: name the first failing stage. Write the functions, save, and run: npm run drill -- drills/2/debugging/triage/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The first area to inspect from the probe evidence.
export function firstFailure(probe: { inScene: boolean; inView: boolean; hasVertices: boolean; hasMaterial: boolean; shaderLinked: boolean }): Answer<string> {
  if (!probe.inScene) return 'scene'; if (!probe.inView) return 'camera'; if (!probe.hasVertices) return 'geometry'; if (!probe.hasMaterial) return 'material'; if (!probe.shaderLinked) return 'pipeline'; return 'ready';
}
