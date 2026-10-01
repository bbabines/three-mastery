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

The preview shows one visible child range without detaching the others.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/isolation/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/isolation/apply-1
```

## The check

The test checks half-open bounds, child order, visibility, and that no child is detached.

<details><summary>Hint</summary>

A reversible visibility change makes a smaller repro without changing ownership.

</details>

## Where else?

How could a visible slice locate a z-fighting part?

<details><summary>A few answers</summary> Keep halving the visible range until the overlapping pair is in the remaining group. </details>
