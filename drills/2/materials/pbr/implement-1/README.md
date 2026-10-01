---
id: 2.materials.pbr.implement.1
loop: 2
tier: core
concepts: [materials.pbr]
mode: implement
context: materials.pbr/chrome
lenses: []
misconceptions: [materials.pbr/half-metal]
---

# Pbr: chrome

> **The job:** Configure a standard material as polished chrome: fully metallic, low roughness, and a neutral base color. Return the same material.

## Task

Configure a standard material as polished chrome: fully metallic, low roughness, and a neutral base color. Return the same material. Write `chromeFinish(material)` and return the same material. Preserve its environment map.

The reflection should stay sharp on the chrome sphere.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/pbr/implement-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/pbr/implement-1
```

## The check

The test checks the metal endpoint, narrow roughness, neutral base color, and unchanged environment map.

<details><summary>Hint</summary> Metalness is an endpoint for a single physical surface, not a slider for gloss. </details>

## Where else?

What property would you change to turn polished chrome into brushed steel?

<details><summary>A few answers</summary> Increase roughness to make brushed steel; keep metalness at the metal endpoint. </details>
