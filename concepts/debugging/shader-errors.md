---
id: debugging.shader-errors
name: Shader errors
domain: debugging
tier: light
prerequisites: [shaders.vertex-vs-fragment, shaders.extending-materials]
misconceptions:
  line-number: '"The line number points at my code."'
contexts:
  on-before-compile: onBeforeCompile mistakes
  typos: Typos
  precision: Precision errors
---

## Definition

When a shader fails to compile, three.js logs the driver's message, whose line numbers count the whole shader three.js built, with its own code in front of yours.
