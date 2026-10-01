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

The test counts a shared interleaved array once and includes the index array bytes.

<details><summary>Hint</summary>

Use each array's byteLength, not its element count; interleaved attributes share an array.

</details>

## Where else?

Where else would counting the same buffer twice mislead an audit?

<details><summary>A few answers</summary> Imported geometry, shared vertex attributes, or variant comparisons. </details>
