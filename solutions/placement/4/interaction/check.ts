import type { Answer } from '@harness/drill';
import * as THREE from 'three';

export function enableSmoothOrbit(controls: { enableDamping: boolean }): Answer<boolean> {
  controls.enableDamping=true; return controls.enableDamping;
}

export function pointerNdc(clientX: number, clientY: number, left: number, top: number, width: number, height: number): Answer<THREE.Vector2> {
  return new THREE.Vector2((clientX-left)/width*2-1,1-(clientY-top)/height*2);
}

export function isDrag(start: THREE.Vector2, end: THREE.Vector2, thresholdPixels: number): Answer<boolean> {
  return start.distanceToSquared(end)>thresholdPixels*thresholdPixels;
}

export function nextHover(hitId: string | null, selectedId: string | null): Answer<string | null> {
  return hitId===selectedId?null:hitId;
}

export function clampedDistance(current: number, delta: number, min: number, max: number): Answer<number> {
  return THREE.MathUtils.clamp(current+delta,min,max);
}

export function dragOrigin(hit: THREE.Vector3, grabbed: THREE.Vector3, originalOrigin: THREE.Vector3): Answer<THREE.Vector3> {
  return hit.clone().add(originalOrigin.clone().sub(grabbed));
}

export function railDelta(motion: THREE.Vector3, axis: THREE.Vector3): Answer<THREE.Vector3> {
  return motion.clone().projectOnVector(axis);
}

export function worldAxis(object: THREE.Object3D, localAxis: THREE.Vector3): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,false); return localAxis.clone().transformDirection(object.matrixWorld);
}

export function orbitAllowed(draggingPart: boolean): Answer<boolean> {
  return !draggingPart;
}

export function focusCenter(object: THREE.Object3D): Answer<THREE.Vector3> {
  object.updateWorldMatrix(true,true); return new THREE.Box3().setFromObject(object,true).getCenter(new THREE.Vector3());
}

export function anchorPixels(camera: THREE.Camera, point: THREE.Vector3, width: number, height: number): Answer<THREE.Vector2> {
  camera.updateMatrixWorld(true); const n=point.clone().project(camera); return new THREE.Vector2((n.x+1)*width/2,(1-n.y)*height/2);
}

export function dampingAlpha(rate: number, deltaSeconds: number): Answer<number> {
  return 1-Math.exp(-rate*deltaSeconds);
}

export function smoothFraction(fraction: number): Answer<number> {
  return THREE.MathUtils.smoothstep(fraction,0,1);
}
