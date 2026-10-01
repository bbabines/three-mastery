---
id: 3.shaders.swizzling.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.swizzling]
mode: break-and-fix
context: shaders.swizzling/packed-textures
lenses: []
misconceptions: []
---

# Swizzling: repair the effect

> **The job:** Read roughness and metalness from a packed ORM vector in shader channel order.

## Task

The roughness readout follows red AO instead of green roughness. Repair `roughMetal`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>


## Your code

Fix `drills/3/shaders/swizzling/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/swizzling/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> For glTF ORM, roughness is G and metalness is B. </details>

## Where else?

Which two channels would `.gb` give for a packed metal surface?

<details><summary>A few answers</summary> Green roughness and blue metalness; red remains ambient occlusion. </details>
