---
id: 2.debugging.isolation.implement.1
loop: 2
tier: core
concepts: [debugging.isolation]
mode: implement
context: debugging.isolation/hotspot
lenses: []
misconceptions: []
---

# Isolation: show one scene branch

> **The job:** Hide unrelated scene branches to reproduce a rendering fault.

## Task

Return the number of top-level branches hidden after making only the chosen direct child visible. The branch and everything inside it remain as they were.

| Function | Return |
| --- | --- |
| `showOnlyBranch(root: THREE.Object3D, keep: THREE.Object3D)` | The number of sibling branches hidden for isolation. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/isolation/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/isolation/implement-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Hide one half at a time to narrow a fault, then restore visibility afterward.

</details>

## Where else?

Where else would the same code help? The concept card lists Z-fighting source, Bad material.
