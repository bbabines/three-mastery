---
id: 2.interaction.placement
loop: 2
domain: interaction
parts:
  - interaction.controls-tour
  - interaction.pointer-events
  - interaction.click-vs-drag
  - interaction.hover-selection
  - interaction.orbit-pan-dolly
  - interaction.drag-on-plane
  - interaction.axis-drag
  - interaction.local-world-manipulation
  - interaction.controls-coexistence
  - interaction.focus-on-object
  - interaction.anchoring
  - interaction.frame-rate-independence
  - interaction.interpolation-toolbox
---

# Placement check: interaction

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `needsControlsUpdate(dampingEnabled: boolean, moved: boolean)` | Whether to call controls.update on the next frame. |
| `canvasNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number })` | Canvas-relative normalized coordinates. |
| `wasDrag(down: THREE.Vector2, up: THREE.Vector2, thresholdCssPx: number)` | Whether movement exceeded the drag threshold. |
| `partState(selected: boolean, hovered: boolean)` | The visual state with selection taking priority. |
| `dollyChanges(camera: THREE.Camera)` | Which camera value the dolly gesture changes. |
| `planeDragLocal(ray: THREE.Ray, plane: THREE.Plane, grabOffset: THREE.Vector3, child: THREE.Object3D)` | The new position in the child's parent space. |
| `railDelta(start: THREE.Vector3, end: THREE.Vector3, axis: THREE.Vector3)` | The world-space drag movement along the axis. |
| `gizmoWorldAxis(object: THREE.Object3D, axis: THREE.Vector3, mode: "local" | "world")` | The chosen local or world axis as a world direction. |
| `setOrbitDragState(controls: { enabled: boolean }, dragging: boolean)` | Whether orbit is enabled after the drag state is applied. |
| `focusCenter(root: THREE.Object3D)` | The world center of the full object bounds. |
| `labelPosition(world: THREE.Vector3, camera: THREE.Camera, rect: { left: number; top: number; width: number; height: number })` | CSS position and visibility for a projected world point. |
| `dampingFraction(lambda: number, dt: number)` | The elapsed-time damping fraction. |
| `focusEase(elapsed: number, duration: number)` | The clamped smoothstep fraction of the focus move. |
