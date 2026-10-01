---
id: 4.shaders.built-in-matrices.cross.1
loop: 4
tier: core
concepts: [transforms.normal-matrix, shaders.built-in-matrices, shaders.debug-output, debugging.isolation]
mode: cross-domain
context: shaders.debug-output/verify-spaces
lenses: [space]
misconceptions: []
---

# Verify a transform bug with normals as color

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A surface-normal debug view should stay tied to the object when the camera moves. Write `worldNormalMaterial()` to return a small GLSL3 `ShaderMaterial`. Transform the vertex normal with the inverse transpose of the object's world matrix, normalize it, and output that world direction mapped from −1..1 to 0..1 RGB. Do not use the built-in `normalMatrix`: it produces view-space normals. Keep this debug output raw.

<div data-scene="normals"></div>

## Spaces

| Value | Space |
| --- | --- |
| Vertex `normal` | Mesh local space |
| Normal after the world normal matrix | World space |
| RGB | Encoded world direction |

## Your code

Write it in `cross/4/world-normal-debug/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/world-normal-debug
```

## The check

A browser check renders an unevenly scaled, rotated plane from two camera positions. The sampled color must describe its world normal and stay unchanged when only the camera moves.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
