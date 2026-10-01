import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function cappedDpr(deviceRatio: number, cap: number): Answer<number> {
  return Math.min(deviceRatio,cap);
}

export function fragmentWork(coveredPixels: number, overdraw: number): Answer<number> {
  return coveredPixels*overdraw;
}

export function drawCallsForGroups(meshes: number, groupsPerMesh: number): Answer<number> {
  return meshes*groupsPerMesh;
}

export function sortMaterials(meshes: THREE.Mesh[]): Answer<THREE.Mesh[]> {
  const opaque = meshes.filter(mesh => !(mesh.material as THREE.Material).transparent);
  const transparent = meshes.filter(mesh => (mesh.material as THREE.Material).transparent);
  opaque.sort((a,b)=>(a.material as THREE.Material).uuid.localeCompare((b.material as THREE.Material).uuid));
  return [...opaque,...transparent];
}

export function earlyDepthLikely(depthTest: boolean, alphaTested: boolean): Answer<boolean> {
  return depthTest&&!alphaTested;
}

export function enableStencilMask(material: THREE.Material, reference: number): Answer<number> {
  material.stencilWrite=true; material.stencilRef=reference; return material.stencilRef;
}

export function enableTransparency(material: THREE.Material): Answer<boolean> {
  material.transparent=true; material.needsUpdate=true; return material.transparent;
}

export function offscreenTarget(width: number, height: number): Answer<THREE.WebGLRenderTarget> {
  return new THREE.WebGLRenderTarget(width,height);
}

export function totalPassDraws(baseDraws: number, passDraws: number[]): Answer<number> {
  return baseDraws+passDraws.reduce((sum,n)=>sum+n,0);
}

export function samplesUsed(target: THREE.WebGLRenderTarget): Answer<number> {
  return target.samples;
}

export function rgbaReadBytes(width: number, height: number): Answer<number> {
  return width*height*4;
}

export function exceedsBudget(frameMs: number, budgetMs: number): Answer<boolean> {
  return frameMs>budgetMs;
}

export function drawCalls(info: THREE.WebGLInfo): Answer<number> {
  return info.render.calls;
}
