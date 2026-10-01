---
id: 2.gpu.placement
loop: 2
domain: gpu
parts:
  - gpu.renderer-tour
  - gpu.pipeline-stages
  - gpu.draw-call-anatomy
  - gpu.state-sorting
  - gpu.depth-early-z
  - gpu.stencil
  - gpu.blending
  - gpu.render-targets
  - gpu.multi-pass
  - gpu.multisampling
  - gpu.readback
  - gpu.frame-budget
  - gpu.measurement
---

# Placement check: gpu

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `capRendererDpr(renderer: Pick<THREE.WebGLRenderer, "setPixelRatio">, deviceDpr: number, cap: number)` | The pixel ratio passed to WebGLRenderer. |
| `stageWork(vertices: number, coveredSamples: number, passes: number)` | Counts of vertex invocations and fragment candidates. |
| `estimatedDraws(root: THREE.Object3D, shadowLights: number)` | Estimated draw submissions across the main and shadow passes. |
| `putOverlayLast(overlay: THREE.Object3D, order: number)` | The overlay renderOrder after setting it. |
| `opaqueOccluder(material: THREE.MeshBasicMaterial)` | The material configured for opaque depth testing and writing. |
| `stencilWriter(material: THREE.Material, reference: number)` | The material configured to write a stencil reference. |
| `glassMaterial(material: THREE.MeshBasicMaterial, opacity: number)` | The blended, depth-tested, non-depth-writing material. |
| `thumbnailTarget(width: number, height: number)` | A thumbnail-sized offscreen render target. |
| `postFragments(width: number, height: number, passes: number)` | The full-screen fragment candidates across the passes. |
| `msaaTarget(width: number, height: number, samples: number)` | The multisampled offscreen target. |
| `readIdPixel(renderer: Pick<THREE.WebGLRenderer, "readRenderTargetPixelsAsync">, target: THREE.WebGLRenderTarget, x: number, y: number)` | The Promise for one RGBA picking pixel. |
| `budgetForHz(refreshHz: number)` | Milliseconds available for one frame. |
| `cpuRenderMs(renderer: Pick<THREE.WebGLRenderer, "render">, scene: THREE.Scene, camera: THREE.Camera, now: () => number)` | Milliseconds spent in the CPU render call. |
