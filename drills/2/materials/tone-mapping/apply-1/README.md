---
id: 2.materials.tone-mapping.apply.1
loop: 2
tier: core
concepts: [materials.tone-mapping]
mode: apply
context: materials.tone-mapping/bright-environments
lenses: []
misconceptions: []
---

# Tone mapping: bright environments

> **The job:** Convert exposure in photographic stops into the renderer exposure multiplier while keeping Neutral tone mapping for bright studio lighting.

## Task

Convert exposure in photographic stops into the renderer exposure multiplier while keeping Neutral tone mapping for bright studio lighting. Write `setExposureStops(renderer, stops)` and return the same renderer. One positive stop doubles exposure; one negative stop halves it.

The preview uses one stops value; the test checks brighter and darker settings.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/tone-mapping/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/tone-mapping/apply-1
```

## The check

The test checks positive and negative stops, Neutral tone mapping, and the original renderer.

<details><summary>Hint</summary> One stop doubles the light multiplier; a negative stop halves it. </details>

## Where else?

How would you make a bright HDR environment one stop darker without changing its texture?

<details><summary>A few answers</summary> Reduce exposure by one stop to halve the multiplier while keeping the HDR environment texture. </details>
