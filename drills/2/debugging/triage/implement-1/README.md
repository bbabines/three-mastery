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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/triage/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/triage/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Check that the object entered the scene and camera before opening shader logs.

</details>

## Where else?

Where else would the same code help? The concept card lists Black screen, Wrong color.
