---
id: 4.shaders.placement
loop: 4
domain: shaders
parts:
  - shaders.vertex-vs-fragment
  - shaders.attributes-uniforms-varyings
  - shaders.built-in-matrices
  - shaders.swizzling
  - shaders.built-in-functions
  - shaders.types-precision
  - shaders.extending-materials
  - shaders.derivatives
  - shaders.fragment-coordinates
  - shaders.branching-discard
  - shaders.debug-output
---

# Placement check: Shaders

A no-docs check of the decisions in this domain. Write every function in `placement/4/shaders/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `stageForPixelColor` | Choose the stage that runs for each covered fragment. |
| `setUniform` | Change a uniform shared across a draw. |
| `worldPointFromModel` | Use the model matrix to put a vertex in world space. |
| `blueRedGreen` | Reorder a vector's channels without changing its input. |
| `clampedLighting` | Clamp a lighting dot product to zero. |
| `precisionForWorldPosition` | Choose shader precision for a large world position. |
| `markShaderChange` | Mark a material for recompilation after a shader edit. |
| `edgeWidth` | Estimate an fwidth-style screen-space change. |
| `fragmentUv` | Map a fragment position into zero-to-one screen coordinates. |
| `keepFragment` | Decide whether a fragment survives alpha cutout. |
| `normalDebugColor` | Encode a normalized direction into raw RGB for a debug view. |
