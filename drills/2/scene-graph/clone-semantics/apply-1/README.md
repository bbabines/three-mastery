---
id: 2.scene-graph.clone-semantics.apply.1
loop: 2
tier: core
concepts: [scene-graph.clone-semantics]
mode: apply
context: scene-graph.clone-semantics/memory-audit
lenses: []
misconceptions: []
---

# Clone: a variant with independent materials

> **The job:** Copy a product tree for a variant without copying its geometry.

## Task

A product has several Mesh descendants. Return a deep clone whose Mesh materials are separate from the source. Geometry remains shared. Handle a Mesh with an array of materials.

| Function | Return |
| --- | --- |
| `cloneForVariant(root: THREE.Object3D)` | A deep tree clone with shared geometry and separate materials. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/clone-semantics/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/clone-semantics/apply-1
```

## The check

The test checks every cloned mesh: geometry stays shared, while single and array materials are independent.

<details><summary>Hint</summary>

A deep Object3D clone makes new nodes, but their geometry and materials still point at the originals.

</details>

## Where else?

Where else must copies share shape but keep separate finishes?

<details><summary>A few answers</summary> Repeated parts, a selected highlight, or color variants. </details>
