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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 memory proof with 20 variant swaps. Record renderer.info.memory.geometries and .textures before and after, plus frame time. Both memory deltas should return to zero after owned resources are disposed.

## Your code

Write it in `drills/2/optimization/leak-detection/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/leak-detection/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

renderer.info.memory tracks geometry and textures, not all materials; check dispose events or programs separately.

</details>

## Where else?

Where else would the same code help? The concept card lists Variant cycling, Long sessions.
