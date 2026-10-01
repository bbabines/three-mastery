---
id: 2.assets.loaders-tour.apply.1
loop: 2
tier: light
concepts: [assets.loaders-tour, assets.load-lifecycle]
mode: apply
context: assets.loaders-tour/canvas-price-tag
lenses: []
misconceptions: []
---

# Loaders: prepare and track an asset

> **The job:** Choose a decoder when an asset needs one and report an honest load state.

## Task

A glTF manifest lists its extensions. Return whether GLTFLoader needs a Draco decoder. Report a load as `loading`, `ready`, or `failed` from its completion and error flags; completion alone does not mean GPU upload is done.

| Function | Return |
| --- | --- |
| `needsDraco(extensions: string[])` | Whether a Draco decoder must be attached. |
| `loadState(completed: boolean, failed: boolean)` | The current async load state. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/assets/loaders-tour/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/assets/loaders-tour/apply-1
```

## The check

The tests distinguish Draco from Meshopt extensions and keep loading, ready, and failed states separate.

<details><summary>Hint</summary>

GLTFLoader requires a decoder for files that declare KHR_draco_mesh_compression.

</details>

## Where else?

Where else does a loader need both setup and an honest state?

<details><summary>A few answers</summary> A compressed product model, a missing environment map, or a failed swatch. </details>
