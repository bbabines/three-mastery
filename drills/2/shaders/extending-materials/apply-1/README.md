---
id: 2.shaders.extending-materials.apply.1
loop: 2
tier: light
concepts: [shaders.extending-materials]
mode: apply
context: shaders.extending-materials/inject-uniforms
lenses: [space]
misconceptions: [shaders.extending-materials/rebuild-lighting]
---

# Extend a lit material with a pulse

> **The job:** add an emissive pulse while keeping Standard material lighting and reflections.

## Task

Write `injectEmissivePulse(material, strength)`. Return the same `MeshStandardMaterial` with an `onBeforeCompile` hook that adds uniform `uPulse` and uses it after `<emissivemap_fragment>` to brighten `totalEmissiveRadiance`. Preserve the material's color, maps, and built-in lighting shader.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `totalEmissiveRadiance` | linear lighting color in the fragment shader |
| `uPulse` | per-draw brightness value |

## Your code

Write the hook in `drills/2/shaders/extending-materials/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/shaders/extending-materials/apply-1
```

## The check

The Node test checks the injection and material identity. The browser check compiles and renders a lit mesh with it.

<details><summary>Hint</summary> `onBeforeCompile` receives the assembled built-in shader before compilation; replace a known include and keep it in the source. </details>

## Where else?

How would you animate the pulse uniform without recreating the material each frame?
