---
id: 2.gpu.depth-early-z.implement.1
loop: 2
tier: core
concepts: [gpu.depth-early-z]
mode: implement
context: gpu.depth-early-z/alpha-tested
lenses: [cost]
misconceptions: []
---

# Depth: set up an opaque occluder

> **The job:** Configure a solid material to write depth as well as color.

## Task

A panel should hide surfaces behind it. Set `transparent` false, `depthTest` true, and `depthWrite` true on its material, then return the material.

| Function | Return |
| --- | --- |
| `opaqueOccluder(material: THREE.MeshBasicMaterial)` | The material configured for opaque depth testing and writing. |

The blue opaque panel should hide the yellow surface behind it through normal depth testing.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/depth-early-z/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/depth-early-z/implement-1
```

## The check

The check verifies that the code restores depth testing and writes after a transparent variant. It also rejects an unanswered function.

<details><summary>Hint</summary>

Depth testing rejects hidden fragments; turning depth writes off makes later draws unable to use that depth.

</details>

## Where else?

What changes when the foreground surface is alpha cut out rather than opaque?
