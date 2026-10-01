---
id: 3.shaders.branching-discard.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.branching-discard]
mode: break-and-fix
context: shaders.branching-discard/conditional-effects
lenses: [cost]
misconceptions: [shaders.branching-discard/if-free]
---

# Branching discard: repair the effect

> **The job:** Estimate fragment work for a mask that discards part of each transparent layer.

## Task

The estimate claims discarded pixels cost nothing even though their fragment shader already ran. Repair `maskFragmentRuns`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>


## Measure

Use Chrome's Performance panel to record frame time and pixel ratio. Compare the calculation with measured work; frame time is not a pass threshold.

## Your code

Fix `drills/3/shaders/branching-discard/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/branching-discard/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> Discard happens during fragment execution and can disable early depth rejection. </details>

## Where else?

What would an alpha-tested opaque cutout change?

<details><summary>A few answers</summary> Surviving pixels can write depth, unlike blended transparent layers. </details>
