// Frame budget: find the limiting side. Write the functions, save, and run: npm run drill -- drills/2/gpu/frame-budget/apply-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// The limiting frame duration and milliseconds over budget.
export function framePressure(cpuMs: number, gpuMs: number, refreshHz: number): Answer<{ frameMs: number; overBudgetMs: number }> {
  return null;
}
