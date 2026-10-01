---
id: 3.materials.channel-packing.break-and-fix.1
loop: 3
tier: light
concepts: [materials.channel-packing]
mode: break-and-fix
context: materials.channel-packing/wrong-roughness
lenses: []
misconceptions: [materials.channel-packing/separate-textures]
---

# Channel packing: repair the preview

> **The job:** Read roughness and metalness from one packed ORM texel.

## Task

The steel looks glossy when its red AO channel is dark even though green roughness is high. Repair `readOrm`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/channel-packing/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/channel-packing/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> ORM puts AO in R, roughness in G, and metalness in B. </details>

## Where else?

Would separate image requests help this packed asset?

<details><summary>A few answers</summary> No. The channels already share one texture; map slots read different channels. </details>
