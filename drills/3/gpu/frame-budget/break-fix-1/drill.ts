// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function headroomMs(cpuMs: number, gpuMs: number, refreshHz: number): number {
  return 1000/refreshHz-cpuMs-gpuMs;
}
