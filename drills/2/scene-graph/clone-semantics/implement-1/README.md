---
id: 2.scene-graph.clone-semantics.implement.1
loop: 2
tier: core
concepts: [scene-graph.clone-semantics]
mode: implement
context: scene-graph.clone-semantics/variant-duplication
lenses: []
misconceptions: []
---

# Clone: a separate finish

> **The job:** Clone one Mesh so its color can change without recoloring the source.

## Task

Return a clone of a Mesh with a new material color. Share its geometry for memory, but give it its own material before changing color.

| Function | Return |
| --- | --- |
| `coloredClone(source: THREE.Mesh, color: THREE.ColorRepresentation)` | A colored clone with shared geometry and independent material. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/scene-graph/clone-semantics/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/scene-graph/clone-semantics/implement-1
```

## The check

The test recolors the copy and checks that its material is separate, its geometry is shared, and the source stays blue.

<details><summary>Hint</summary>

Object3D.clone shares geometry and material by default. Clone only the material before recoloring.

</details>

## Where else?

Where else could editing a clone unexpectedly change its source?

<details><summary>A few answers</summary> A single part highlight, a finish preview, or a copied scene prop. </details>
