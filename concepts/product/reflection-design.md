---
id: product.reflection-design
name: Reflection and HDR design
domain: product
prerequisites: [product.light-form, materials.environment-maps]
misconceptions:
  any-studio: '"Any studio HDR produces convincing polished metal."'
  soften-metal: '"Soft reflections require raising material roughness."'
  automatic-capture: '"A bright plane in the scene is automatically reflected by the environment map."'
  hero-only: '"A good opening view proves a configurator lighting rig works."'
contexts:
  watch: Reading a polished case
  jewelry: Designing metal and gem environments
  plastic: Shaping glossy plastic highlights
  orbit: Covering an entire camera orbit
---

## Definition

Arrange bright panels, source gradients, and dark boundaries in the environment so reflected light explains product curvature while preserving material identity throughout the allowed views.

## Cost lens

HDRs cost downloads, GPU memory, and prefiltering. Rebuilding a studio requires a new environment capture or prefilter; update it only when source settings change. Material roughness reads the filtered representation without rebuilding it.
