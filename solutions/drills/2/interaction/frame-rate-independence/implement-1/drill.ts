// Smoothing: one rate at every refresh speed. Write the functions, save, and run: npm run drill -- drills/2/interaction/frame-rate-independence/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The elapsed-time damping fraction.
export function dampingFraction(lambda: number, dt: number): Answer<number> {
  return 1 - Math.exp(-lambda * dt);
}
