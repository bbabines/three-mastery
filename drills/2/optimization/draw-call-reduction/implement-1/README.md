---
id: 2.optimization.draw-call-reduction.implement.1
loop: 2
tier: core
concepts: [optimization.draw-call-reduction]
mode: implement
context: optimization.draw-call-reduction/static-environment
lenses: [cost]
misconceptions: []
---

# Draw calls: instance a static structure

> **The job:** Submit many repeated parts through one InstancedMesh.

## Task

A static room uses the same bracket at several positions. Build an InstancedMesh, set one Matrix4 per bracket, and return it. The instance count should equal the placements count. Keep the bracket size and screen coverage fixed when comparing draw counts.

| Function | Return |
| --- | --- |
| `instanceHardware(geometry: THREE.BufferGeometry, material: THREE.Material, placements: THREE.Matrix4[])` | One InstancedMesh carrying each copy transform. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 draw-call experiment with equal screen coverage. Record `renderer.info.render.calls` before and after instancing, plus the live frame-time average. Keep the same three placements. A lower draw count is the invariant; frame time has no fixed pass bar.

## Your code

Write it in `drills/2/optimization/draw-call-reduction/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/draw-call-reduction/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Instancing reduces CPU draw submissions, not fragment work.

</details>

## Where else?

Where else would the same code help? The concept card lists Repeated hardware, Many same-material parts.
