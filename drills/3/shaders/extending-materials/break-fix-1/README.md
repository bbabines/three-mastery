---
id: 3.shaders.extending-materials.break-and-fix.1
loop: 3
tier: light
concepts: [shaders.extending-materials]
mode: break-and-fix
context: shaders.extending-materials/highlight
lenses: [space]
misconceptions: [shaders.extending-materials/rebuild-lighting]
---

# Extend the product highlight without losing lighting

> **The job:** add a custom emissive highlight to an existing Standard material.

## Task

The product's pulse appears, but its normal map and environment reflections disappear and the surface looks flat. Repair `addPulse` so it keeps the supplied material and inserts a small shader change at compile time.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| `totalEmissiveRadiance` | linear fragment lighting color |
| `uPulse` | uniform brightness for the whole draw |

## Your code

Fix `drills/3/shaders/extending-materials/break-fix-1/drill.ts`, name the cause in `cause.md`, and assert the regression in `check.ts`.

```
npm run drill -- drills/3/shaders/extending-materials/break-fix-1
```

## The check

The acceptance test checks material identity, map preservation, the injected uniform, and WebGL compilation. Your check must reject the flat replacement shader.

<details><summary>Hint</summary> `onBeforeCompile` edits the assembled Standard shader and keeps its lighting chunks. </details>

## Where else?

How would you add a dissolve effect while keeping Standard material reflections?

<details><summary>A few answers</summary> Patch the built-in fragment stage with a uniform and mask instead of replacing the whole material. </details>
