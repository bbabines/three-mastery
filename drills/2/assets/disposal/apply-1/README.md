---
id: 2.assets.disposal.apply.1
loop: 2
tier: core
concepts: [assets.disposal]
mode: apply
context: assets.disposal/long-sessions
lenses: [cost]
misconceptions: []
---

# Dispose: remove a retired variant

> **The job:** Release a retired variant while keeping resources used by the active scene.

## Task

Remove a Mesh from its parent. Traverse the remaining scene to find geometry and materials still used; dispose only the removed Mesh resources no longer used. Return the number disposed.

| Function | Return |
| --- | --- |
| `retireVariant(root: THREE.Object3D, retired: THREE.Mesh)` | The number of no-longer-used geometry and material resources disposed. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/disposal/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/disposal/apply-1
```

## The check

The test retires one mesh, keeps shared geometry alive, and checks that its unique material is disposed once.

<details><summary>Hint</summary>

Inspect what remains before disposing shared resources.

</details>

## Where else?

Where else must a retired object leave shared resources alive?

<details><summary>A few answers</summary> A variant switch, a deleted selection, or a product route change. </details>
