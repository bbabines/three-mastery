---
id: 2.assets.memory-math.implement.1
loop: 2
tier: core
concepts: [assets.memory-math]
mode: implement
context: assets.memory-math/tab-crash
lenses: [cost]
misconceptions: []
---

# Memory: count geometry arrays

> **The job:** Count bytes held by geometry attributes and its index.

## Task

Return the byte count for the arrays attached to a BufferGeometry. Two attributes may share one interleaved array; count that array once. Include the index array.

| Function | Return |
| --- | --- |
| `geometryArrayBytes(geometry: THREE.BufferGeometry)` | The total bytes of unique attribute and index arrays. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/memory-math/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/memory-math/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Use each array's byteLength, not its element count; interleaved attributes share an array.

</details>

## Where else?

Where else would the same code help? The concept card lists A model's footprint, Comparing variants.
