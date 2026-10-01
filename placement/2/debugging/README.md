---
id: 2.debugging.placement
loop: 2
domain: debugging
parts:
  - debugging.triage
  - debugging.nothing-renders
  - debugging.helpers
  - debugging.visualizing-vectors
  - debugging.reading-matrices
  - debugging.nan-degenerate
  - debugging.isolation
  - debugging.frame-capture
  - debugging.shader-errors
  - debugging.debug-views
---

# Placement check: debugging

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `firstFailure(probe: { inScene: boolean; inView: boolean; hasVertices: boolean; hasMaterial: boolean; shaderLinked: boolean })` | The first area to inspect from the probe evidence. |
| `inCameraView(object: THREE.Object3D, camera: THREE.Camera)` | Whether the object world bounds touch the camera frustum. |
| `boundsHelper(object: THREE.Object3D)` | A BoxHelper that shows the object bounds. |
| `worldArrowDirection(object: THREE.Object3D, local: THREE.Vector3)` | The unit direction for a world-space ArrowHelper. |
| `matrixTranslation(matrix: THREE.Matrix4)` | The translation Vector3 encoded in the matrix. |
| `finiteOrZero(vector: THREE.Vector3)` | The unchanged finite vector or a zero-vector fallback. |
| `showOnlyBranch(root: THREE.Object3D, keep: THREE.Object3D)` | The number of sibling branches hidden for isolation. |
| `captureFrameCounts(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera)` | Draw calls and triangles recorded after a render. |
| `authoredShaderLine(log: string, injectedLines: number)` | The authored shader line, or −1 when the log has no line. |
| `debugViewMaterial(view: "normal" | "depth" | "wireframe")` | A material that reveals normals, depth, or mesh edges. |
