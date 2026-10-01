---
id: 3.materials.color-spaces.break-and-fix.1
loop: 3
tier: core
concepts: [materials.color-spaces]
mode: break-and-fix
context: materials.color-spaces/washed-out
lenses: []
misconceptions: [materials.color-spaces/all-srgb]
---

# Color spaces: washed-out normal detail

> **The job:** Keep the color photograph in sRGB and the normal map as linear data.

## Task

The base color looks right, but lighting detail is washed out after both maps load. Repair `markMaps` without replacing the textures. Watch the readout change.

<div data-scene="preview"></div>

## Your code

Repair `drills/3/materials/color-spaces/break-fix-1/drill.ts`, write one sentence in `cause.md`, and replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/materials/color-spaces/break-fix-1
```

## The check

The acceptance test covers the visible symptom and a second input. Your short check must reject the original bug and pass on the repair; `npm run verify` exercises both versions.

<details><summary>Hint</summary> Texture channels that store vectors or scalar data must not receive sRGB decoding. </details>

## Where else?

What would happen if the roughness map received the same mistaken tag?

<details><summary>A few answers</summary> Its numeric roughness values would be transformed before lighting, shifting highlight width. </details>
