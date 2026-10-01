---
id: 2.debugging.triage.apply.1
loop: 2
tier: core
concepts: [debugging.triage]
mode: apply
context: debugging.triage/wrong-color
lenses: []
misconceptions: []
---

# Triage: trace a wrong color

> **The job:** Separate a color texture setup fault from a renderer output fault.

## Task

A product color map appears washed out. Return `material` if its map is missing sRGB color space, `pipeline` if renderer output is not sRGB, or `ready` when both are set. This is a first diagnostic step, before changing lights or shaders.

| Function | Return |
| --- | --- |
| `colorFaultArea(material: THREE.MeshStandardMaterial, outputColorSpace: string)` | The first color setup area to inspect. |

The preview reports the first color fault for its fixed map and output settings.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/triage/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/triage/apply-1
```

## The check

The test checks the map's color space before renderer output and returns ready only when both are correct.

<details><summary>Hint</summary>

A color map uses sRGB input; output color conversion is a renderer setting.

</details>

## Where else?

What should you inspect first when a color map looks washed out?

<details><summary>A few answers</summary> Check the map's sRGB tag, then the renderer output color space before touching lights. </details>
