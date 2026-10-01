---
id: 2.debugging.isolation.apply.1
loop: 2
tier: core
concepts: [debugging.isolation]
mode: apply
context: debugging.isolation/bad-material
lenses: []
misconceptions: []
---

# Isolation: bisect a scene

> **The job:** Toggle half of a large scene to locate a bad object.

## Task

Show only children in the half-open index interval `[start, end)` and hide the rest. Return the visible names in order. Keep all children attached so the change can be reversed.

| Function | Return |
| --- | --- |
| `visibleSlice(root: THREE.Object3D, start: number, end: number)` | Names of the visible half of the scene. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/isolation/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/isolation/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A reversible visibility change makes a smaller repro without changing ownership.

</details>

## Where else?

Where else would the same code help? The concept card lists Z-fighting source, Performance hotspot.
