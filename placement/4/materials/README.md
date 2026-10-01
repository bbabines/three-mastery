---
id: 4.materials.placement
loop: 4
domain: materials
parts:
  - materials.materials-tour
  - materials.lights-tour
  - materials.color-spaces
  - materials.tone-mapping
  - materials.lambert
  - materials.specular
  - materials.pbr
  - materials.light-types
  - materials.environment-maps
  - materials.shadows
  - materials.baked-lighting
  - materials.texture-sampling
  - materials.channel-packing
  - materials.material-flags
---

# Placement check: Materials, lighting, and color

A no-docs check of the decisions in this domain. Write every function in `placement/4/materials/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `materialForLight` | Choose a lit material only when lighting is needed. |
| `setLightStrength` | Set the light's intensity for a comparison. |
| `markColorMap` | Mark a display-color texture as sRGB. |
| `exposureChoice` | Apply an exposure change measured in stops. |
| `diffuseFactor` | Compute clamped diffuse response for normalized directions. |
| `halfDirection` | Find the half direction between light and view. |
| `metalNeedsEnvironment` | Judge whether a metal finish lacks reflections. |
| `shadowCapable` | Judge whether a light type can cast shadows. |
| `applyEnvironment` | Set an environment map independently of the background. |
| `castShadow` | Enable a light to cast shadows. |
| `attachLightMap` | Attach a baked light map to a material. |
| `useMipFiltering` | Choose trilinear minification for a mipmapped texture. |
| `roughnessByte` | Read roughness from the green channel of a packed map. |
| `makeCutout` | Turn on alpha testing for a cutout material. |
