---
id: 2.materials.environment-maps.apply.1
loop: 2
tier: core
concepts: [materials.environment-maps]
mode: apply
context: materials.environment-maps/chrome
lenses: []
misconceptions: []
---

# Environment maps: chrome reflections

> **The job:** Give a chrome product material its own reflection texture and intensity without replacing the material; use full metalness and low roughness.

## Task

Give a chrome product material its own reflection texture and intensity without replacing the material; use full metalness and low roughness. Write `localChromeReflection(material, reflection, intensity)` and return the same material. Keep its other maps.

After you answer, the sphere should reflect the supplied texture at the requested strength.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/environment-maps/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/environment-maps/apply-1
```

## The check

The test checks full metalness, low roughness, the supplied map and intensity, and that the original material is returned.

<details><summary>Hint</summary> A visible scene background is not automatically the material envMap. </details>

## Where else?

When would a scene-wide environment be simpler than a per-material map?

<details><summary>A few answers</summary> Several products in one studio can share `scene.environment`; use a material map when one object needs a different reflection. </details>
