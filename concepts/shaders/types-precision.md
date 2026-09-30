---
id: shaders.types-precision
name: Types and precision
domain: shaders
tier: light
prerequisites: [shaders.attributes-uniforms-varyings, math.float-tolerance]
misconceptions:
  int-is-float: '"1 and 1.0 are the same in GLSL."'
contexts:
  compile-errors: Compile errors
  mobile-banding: Banding on mobile
  far-jitter: Jitter far from the origin
---

## Definition

GLSL never converts between whole numbers and decimals for you, and every decimal has a precision that sets how finely it can tell nearby numbers apart.

## Cost lens

Lower precision can save GPU time on some mobile GPUs, but three.js asks for `highp` by default, and any saving is something to measure on the device.
