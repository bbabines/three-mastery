---
id: 2.materials.pbr.apply.1
loop: 2
tier: core
concepts: [materials.pbr]
mode: apply
context: materials.pbr/brushed
lenses: []
misconceptions: [materials.pbr/half-metal]
---

# Pbr: brushed

> **The job:** Configure a brushed steel material. Keep metalness at the metal endpoint, make reflections broader than polished chrome, and use the supplied finish color.

## Task

Configure a brushed steel material. Keep metalness at the metal endpoint, make reflections broader than polished chrome, and use the supplied finish color. Write `brushedSteel(material, color)` and return that material. Preserve its normal and environment maps.

After you answer, the preview should show a broader reflection than polished chrome.

<div data-scene="preview"></div>

## Your code

Write the exported function in `drills/2/materials/pbr/apply-1/drill.ts`. Save and run:

```
npm run drill -- drills/2/materials/pbr/apply-1
```

## The check

The test requires metalness at the metal endpoint, higher roughness, the supplied color, and preservation of the normal map.

<details><summary>Hint</summary> Roughness widens reflections; metalness says whether the surface is metal. </details>

## Where else?

Which channel describes scratches in a roughness texture?

<details><summary>A few answers</summary> Scratches vary the roughness channel. They change reflection width without turning the surface into a nonmetal. </details>
