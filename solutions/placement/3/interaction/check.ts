import type { Answer } from '@harness/drill';
import * as THREE from 'three';

// 'Tour: controls': Whether to call controls.update on the next frame.
export function needsControlsUpdate(dampingEnabled: boolean, moved: boolean): Answer<boolean> {
  return dampingEnabled || moved;
}

// Pointer events: Canvas-relative normalized coordinates.
export function canvasNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }): Answer<THREE.Vector2> {
  return new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, 1 - ((clientY - rect.top) / rect.height) * 2);
}

// Click vs drag: Whether movement exceeded the drag threshold.
export function wasDrag(down: THREE.Vector2, up: THREE.Vector2, thresholdCssPx: number): Answer<boolean> {
  return down.distanceTo(up) > thresholdCssPx;
}

// Hover and selection state: The visual state with selection taking priority.
export function partState(selected: boolean, hovered: boolean): Answer<'selected' | 'hover' | 'none'> {
  return selected ? 'selected' : hovered ? 'hover' : 'none';
}

// Orbit, pan, dolly: Which camera value the dolly gesture changes.
export function dollyChanges(camera: THREE.Camera): Answer<'distance' | 'zoom'> {
  return camera instanceof THREE.OrthographicCamera ? 'zoom' : 'distance';
}

// Drag on a plane: The new position in the child's parent space.
export function planeDragLocal(ray: THREE.Ray, plane: THREE.Plane, grabOffset: THREE.Vector3, child: THREE.Object3D): Answer<THREE.Vector3> {
  const hit = ray.intersectPlane(plane, new THREE.Vector3());
  if (!hit) return child.position.clone();
  child.parent?.updateMatrixWorld(true);
  return child.parent ? child.parent.worldToLocal(hit.add(grabOffset)) : hit.add(grabOffset);
}

// Axis-constrained drag: The world-space drag movement along the axis.
export function railDelta(start: THREE.Vector3, end: THREE.Vector3, axis: THREE.Vector3): Answer<THREE.Vector3> {
  return end.clone().sub(start).projectOnVector(axis);
}

// Local vs world manipulation: The chosen local or world axis as a world direction.
export function gizmoWorldAxis(object: THREE.Object3D, axis: THREE.Vector3, mode: "local" | "world"): Answer<THREE.Vector3> {
  if (mode === "world") return axis.clone().normalize();
  return axis.clone().normalize().applyQuaternion(object.getWorldQuaternion(new THREE.Quaternion()));
}

// Controls coexistence: Whether orbit is enabled after the drag state is applied.
export function setOrbitDragState(controls: { enabled: boolean }, dragging: boolean): Answer<boolean> {
  controls.enabled = !dragging;
  return controls.enabled;
}

// Focus on object: The world center of the full object bounds.
export function focusCenter(root: THREE.Object3D): Answer<THREE.Vector3> {
  root.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(root,true).getCenter(new THREE.Vector3());
}

// 3D-to-2D anchoring: CSS position and visibility for a projected world point.
export function labelPosition(world: THREE.Vector3, camera: THREE.Camera, rect: { left: number; top: number; width: number; height: number }): Answer<{ x: number; y: number; visible: boolean }> {
  camera.updateMatrixWorld();
  const ndc = world.clone().project(camera);
  const toPoint = world.clone().sub(camera.getWorldPosition(new THREE.Vector3()));
  const forward = new THREE.Vector3(0,0,-1).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion()));
  return { x: rect.left + (ndc.x+1)*rect.width/2, y: rect.top + (1-ndc.y)*rect.height/2, visible: toPoint.dot(forward)>0 && Math.abs(ndc.x)<=1 && Math.abs(ndc.y)<=1 && ndc.z>=-1 && ndc.z<=1 };
}

// Frame-rate-independent motion: The elapsed-time damping fraction.
export function dampingFraction(lambda: number, dt: number): Answer<number> {
  return 1 - Math.exp(-lambda * dt);
}

// Interpolation toolbox: The clamped smoothstep fraction of the focus move.
export function focusEase(elapsed: number, duration: number): Answer<number> {
  return THREE.MathUtils.smoothstep(elapsed,0,duration);
}
