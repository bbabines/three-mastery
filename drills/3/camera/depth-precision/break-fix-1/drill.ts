// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function depthBufferValue(near: number, far: number, viewDepth: number): number {
  return (viewDepth-near)/(far-near);
}
