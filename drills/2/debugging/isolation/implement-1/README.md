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

The preview keeps one branch and hides its siblings.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/isolation/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/isolation/implement-1
```

## The check

The test checks the hidden count, chosen branch visibility, and unchanged child structure.

<details><summary>Hint</summary>

Hide one half at a time to narrow a fault, then restore visibility afterward.

</details>

## Where else?

How could hiding one branch locate a bad material?

<details><summary>A few answers</summary> Hide a branch, observe whether the artifact disappears, then narrow within the responsible branch. </details>
