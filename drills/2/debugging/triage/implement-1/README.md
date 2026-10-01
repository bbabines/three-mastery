---
id: 2.debugging.triage.implement.1
loop: 2
tier: core
concepts: [debugging.triage]
mode: implement
context: debugging.triage/missing-object
lenses: []
misconceptions: []
---

# Triage: name the first failing stage

> **The job:** Classify a missing picture before editing code.

## Task

A render probe reports which stages have evidence. Return the earliest failing area in the order scene, camera, geometry, material, pipeline; return `ready` when all have evidence. A black screen alone is not proof of a shader bug.

| Function | Return |
| --- | --- |
| `firstFailure(probe: { inScene: boolean; inView: boolean; hasVertices: boolean; hasMaterial: boolean; shaderLinked: boolean })` | The first area to inspect from the probe evidence. |

The preview reports the first missing stage in one probe.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/triage/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/triage/implement-1
```

## The check

The test checks each stage in order and returns ready only when all five are present.

<details><summary>Hint</summary>

Check that the object entered the scene and camera before opening shader logs.

</details>

## Where else?

What comes before shader debugging for a black screen?

<details><summary>A few answers</summary> Confirm the scene has an object in view with vertices and a material before checking the pipeline. </details>
