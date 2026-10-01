---
id: 2.assets.disposal.implement.1
loop: 2
tier: core
concepts: [assets.disposal]
mode: implement
context: assets.disposal/spa-route
lenses: [cost]
misconceptions: []
---

# Dispose: release only owned resources

> **The job:** Dispose a removed Mesh without freeing resources still used elsewhere.

## Task

A variant Mesh is removed but its geometry may be shared. Dispose its geometry, material, and material textures only when each is not in the `shared` set. Return how many unique resources were disposed.

| Function | Return |
| --- | --- |
| `disposeMeshOwned(mesh: THREE.Mesh, shared: Set<THREE.Material | THREE.BufferGeometry | THREE.Texture>)` | The number of unique owned resources disposed. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/assets/disposal/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/disposal/implement-1
```

## The check

The test watches dispose events: owned material and texture must go, while shared geometry stays.

<details><summary>Hint</summary>

Removing a Mesh does not dispose resources; shared resources must remain alive.

</details>

## Where else?

Where else do you need to separate owned from shared GPU data?

<details><summary>A few answers</summary> A product variant, a reusable model library, or a long editing session. </details>
