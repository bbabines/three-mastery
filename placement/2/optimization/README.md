---
id: 2.optimization.placement
loop: 2
domain: optimization
parts:
  - optimization.draw-call-reduction
  - optimization.resolution-dpr
  - optimization.render-on-demand
  - optimization.allocation-hygiene
  - optimization.culling-lod
  - optimization.overdraw
  - optimization.shader-cost
  - optimization.texture-budget
  - optimization.hitch-avoidance
  - optimization.leak-detection
  - optimization.adaptive-quality
---

# Placement check: optimization

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `instanceHardware(geometry: THREE.BufferGeometry, material: THREE.Material, placements: THREE.Matrix4[])` | One InstancedMesh carrying each copy transform. |
| `pixelRatioFor(deviceRatio: number, cap: number)` | A safe pixel ratio capped for this renderer. |
| `shouldDraw(changed: boolean, tabVisible: boolean)` | Whether this frame needs rendering. |
| `closestInto(ray: THREE.Ray, point: THREE.Vector3, scratch: THREE.Vector3)` | The same scratch Vector3 filled with the nearest ray point. |
| `lodLevel(distance: number, thresholds: number[])` | The detail level selected by distance. |
| `makeCutout(material: THREE.MeshBasicMaterial, threshold: number)` | The alpha-tested, depth-writing panel material. |
| `enabledPhysicalFeatures(material: THREE.MeshPhysicalMaterial)` | How many optional physical shader features are enabled. |
| `rgbaMipBytes(width: number, height: number)` | Decoded RGBA8 bytes including the full mip chain. |
| `precompileScene(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera)` | The Promise for shader compilation before first use. |
| `swapMemoryDelta(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera, swap: () => void, cycles: number)` | The change in GPU geometry and texture counts after swaps. |
| `qualityStep(level: number, frameMs: number, targetMs: number, bandMs: number)` | The next quality level from measured frame time. |
