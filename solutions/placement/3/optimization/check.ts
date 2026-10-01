import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// Draw call reduction: One InstancedMesh carrying each copy transform.
export function instanceHardware(geometry: THREE.BufferGeometry, material: THREE.Material, placements: THREE.Matrix4[]): Answer<THREE.InstancedMesh> {
  const mesh=new THREE.InstancedMesh(geometry,material,placements.length); placements.forEach((matrix,index)=>mesh.setMatrixAt(index,matrix)); mesh.instanceMatrix.needsUpdate=true; return mesh;
}

// Resolution and DPR: A safe pixel ratio capped for this renderer.
export function pixelRatioFor(deviceRatio: number, cap: number): Answer<number> {
  return Math.min(Math.max(1,Number.isFinite(deviceRatio)?deviceRatio:1),cap);
}

// Render on demand: Whether this frame needs rendering.
export function shouldDraw(changed: boolean, tabVisible: boolean): Answer<boolean> {
  return changed && tabVisible;
}

// Allocation hygiene: The same scratch Vector3 filled with the nearest ray point.
export function closestInto(ray: THREE.Ray, point: THREE.Vector3, scratch: THREE.Vector3): Answer<THREE.Vector3> {
  return ray.closestPointToPoint(point,scratch);
}

// Culling and LOD: The detail level selected by distance.
export function lodLevel(distance: number, thresholds: number[]): Answer<number> {
  return thresholds.filter(threshold=>distance>=threshold).length;
}

// Overdraw reduction: The alpha-tested, depth-writing panel material.
export function makeCutout(material: THREE.MeshBasicMaterial, threshold: number): Answer<THREE.MeshBasicMaterial> {
  material.alphaTest=threshold; material.transparent=false; material.depthWrite=true; return material;
}

// Shader and material cost: How many optional physical shader features are enabled.
export function enabledPhysicalFeatures(material: THREE.MeshPhysicalMaterial): Answer<number> {
  return Number(material.clearcoat>0)+Number(material.sheen>0)+Number(material.transmission>0);
}

// Texture budget: Decoded RGBA8 bytes including the full mip chain.
export function rgbaMipBytes(width: number, height: number): Answer<number> {
  let total=0; while(true){total+=width*height*4; if(width===1 && height===1)break; width=Math.max(1,Math.floor(width/2)); height=Math.max(1,Math.floor(height/2));} return total;
}

// Hitch avoidance: The Promise for shader compilation before first use.
export function precompileScene(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera): Answer<Promise<THREE.Object3D>> {
  return renderer.compileAsync(scene,camera);
}

// Leak detection: The change in GPU geometry and texture counts after swaps.
export function swapMemoryDelta(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera, swap: () => void, cycles: number): Answer<{ geometries: number; textures: number }> {
  renderer.render(scene,camera); const before={...renderer.info.memory}; for(let i=0;i<cycles;i++){swap();renderer.render(scene,camera);} return {geometries:renderer.info.memory.geometries-before.geometries,textures:renderer.info.memory.textures-before.textures};
}

// Adaptive quality: The next quality level from measured frame time.
export function qualityStep(level: number, frameMs: number, targetMs: number, bandMs: number): Answer<number> {
  if(frameMs>targetMs+bandMs)return Math.max(0,level-1); if(frameMs<targetMs-bandMs)return Math.min(3,level+1); return level;
}
