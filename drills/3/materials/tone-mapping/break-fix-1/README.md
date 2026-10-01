---
id: 3.materials.tone-mapping.break-and-fix.1
loop: 3
tier: core
concepts: [materials.tone-mapping]
mode: break-and-fix
context: materials.tone-mapping/product-colors
lenses: []
misconceptions: [materials.tone-mapping/brand-colors]
---

# Tone mapping: shifted product color

> **The job:** Keep a color-critical product close to its source color while preserving HDR highlight compression.

## Task

The product shifts hue under studio lights even with the correct source color and exposure. Fix `brandTone` without replacing unrelated objects or settings. The preview runs the current code; use its readout to check the repaired behavior.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/tone-mapping/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/tone-mapping/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> The tone-mapping operator can change hue and saturation independently of exposure. </details>

## Where else?

Would a cinematic sunset make the same color-preservation tradeoff?

<details><summary>A few answers</summary> ACES may be appropriate for a deliberate filmic look; Neutral suits color-critical products. </details>
