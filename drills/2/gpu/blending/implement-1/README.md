---
id: 2.gpu.blending.implement.1
loop: 2
tier: core
concepts: [gpu.blending]
mode: implement
context: gpu.blending/fades
lenses: [cost]
misconceptions: []
---

# Blending: set up a glass layer

> **The job:** Let a translucent mesh blend without writing a solid depth block.

## Task

Configure a material for glass with the given opacity. Enable transparency, keep depth testing, and turn depth writes off so later transparent objects are not hidden by its depth.

| Function | Return |
| --- | --- |
| `glassMaterial(material: THREE.MeshBasicMaterial, opacity: number)` | The blended, depth-tested, non-depth-writing material. |

Look through the blue glass at the yellow part. The glass should blend while leaving depth available for the part behind it.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/blending/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/blending/implement-1
```

## The check

The check verifies that the code keeps a translucent surface from writing opaque depth. It also rejects an unanswered function.

<details><summary>Hint</summary>

three.js leaves depthWrite on unless you set it false for transparent layers.

</details>

## Where else?

Where would a fading overlay need depth testing without writing depth?
