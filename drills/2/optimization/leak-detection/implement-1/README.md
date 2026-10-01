---
id: 2.optimization.leak-detection.implement.1
loop: 2
tier: core
concepts: [optimization.leak-detection]
mode: implement
context: optimization.leak-detection/spa-routes
lenses: [cost]
misconceptions: []
---

# Leak check: measure repeated route changes

> **The job:** Compare renderer memory before and after repeated view loads and unloads.

## Task

Render once to establish GPU memory counts. Run the supplied replacement-and-dispose action `cycles` times, as if a single-page app changed views, rendering after each. Return the change in geometry and texture counts. A retained resource grows the ending count.

| Function | Return |
| --- | --- |
| `swapMemoryDelta(renderer: Pick<THREE.WebGLRenderer, "render" | "info">, scene: THREE.Scene, camera: THREE.Camera, swap: () => void, cycles: number)` | The change in GPU geometry and texture counts after swaps. |

The preview reports memory deltas after its fixed swap cycle.

<div data-scene="practice"></div>

## Measure

Swap variants at least 20 times. Record `renderer.info.memory.geometries` and `.textures` after each unload, plus frame time. The counts should return to the first unloaded baseline when owned resources are disposed.

## Your code

Write it in `drills/2/optimization/leak-detection/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/leak-detection/implement-1
```

## The check

The test renders before measuring, repeats the swap, and checks the change in both memory counters.

<details><summary>Hint</summary>

renderer.info.memory tracks geometry and textures, not all materials; check dispose events or programs separately.

</details>

## Where else?

Why measure after several route changes?

<details><summary>A few answers</summary> A single swap can hide a slow leak; repeated unloads reveal a baseline that keeps climbing. </details>
