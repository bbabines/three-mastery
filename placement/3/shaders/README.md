---
id: 3.shaders.placement
loop: 2
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

# Placement check: shaders

> **What it is for:** see which shader concepts you can use from memory before Loop 3 repair drills.

No docs or three.js source. Write all eleven functions in `placement/3/shaders/check.ts`, then run `npm run pick -- done` once. The first attempt counts.

| Function | Returns |
| --- | --- |
| `fragmentEstimate` | Estimate fragment invocations. |
| `interpolateVarying` | Interpolate a varying across an edge. |
| `worldPoint` | Transform a local vertex into world space. |
| `zUpToYUp` | Convert a Z-up point to right-handed Y-up. |
| `softStep` | Smoothly blend across an edge. |
| `floatLiteral` | Write a GLSL float literal, including .0 for integers. |
| `extensionRoute` | Choose the route that preserves built-in lighting when needed. |
| `pixelFootprint` | Estimate fwidth from neighboring pixel derivatives. |
| `cssCoord` | Convert a fragment coordinate from device to CSS pixels. |
| `insideMask` | Whether a UV fragment survives a centered circular mask. |
| `normalDebug` | Encode a normalized direction as visible RGB. |
