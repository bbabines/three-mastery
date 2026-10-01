---
id: 3.materials.pbr.break-and-fix.1
loop: 3
tier: core
concepts: [materials.pbr]
mode: break-and-fix
context: materials.pbr/steel-coat-rubber
lenses: []
misconceptions: [materials.pbr/half-metal]
---

# Pbr: the painted part has halfway metalness, giving an implausible mix of metal and dielectric reflection.

> **The job:** Distinguish bare steel from opaque powder coat and rubber in a product material set.

## Task

The painted part has halfway metalness, giving an implausible mix of metal and dielectric reflection. Fix `productFinish` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/pbr/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/pbr/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> An opaque coating is a dielectric even when metal lies beneath it. </details>

## Where else?

How would brushed bare steel change without becoming half metal?

<details><summary>A few answers</summary> Keep metalness at 1 and increase roughness to broaden its reflections. </details>
