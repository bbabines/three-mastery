// Reference repair for drills/3/gpu/frame-budget/break-fix-1.
import * as THREE from 'three';

export function headroomMs(cpuMs: number, gpuMs: number, refreshHz: number): number {
  return 1000/refreshHz-Math.max(cpuMs,gpuMs);
}
