import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function canInstanceTogether(a: THREE.Mesh, b: THREE.Mesh): Answer<boolean> {
  return a.geometry===b.geometry&&a.material===b.material;
}

export function pixelCount(width: number, height: number, dpr: number): Answer<number> {
  return width*height*dpr*dpr;
}

export function needsRender(changed: boolean, animating: boolean): Answer<boolean> {
  return changed||animating;
}

export function reusePoint(target: THREE.Vector3, x: number, y: number, z: number): Answer<THREE.Vector3> {
  return target.set(x,y,z);
}

export function useLowDetail(distance: number, switchDistance: number): Answer<boolean> {
  return distance>switchDistance;
}

export function shadedFragments(pixels: number, layers: number): Answer<number> {
  return pixels*layers;
}

export function shaderWork(pixels: number, passes: number, workPerFragment: number): Answer<number> {
  return pixels*passes*workPerFragment;
}

export function textureBytes(width: number, height: number, channels: number, bytesPerChannel: number): Answer<number> {
  return width*height*channels*bytesPerChannel;
}

export function prewarmNeeded(newProgram: boolean, newTexture: boolean): Answer<boolean> {
  return newProgram||newTexture;
}

export function grewAfterCycle(before: number, after: number): Answer<boolean> {
  return after>before;
}

export function nextDpr(current: number, frameMs: number, budgetMs: number, min: number): Answer<number> {
  return frameMs>budgetMs?Math.max(min,current-0.25):current;
}
