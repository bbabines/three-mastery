---
id: 2.optimization.shader-cost.apply.1
loop: 2
tier: light
concepts: [optimization.shader-cost, optimization.hitch-avoidance]
mode: apply
context: optimization.shader-cost/many-lights
lenses: [cost]
misconceptions: []
---

# Shader cost and hitches: choose, then pre-warm

> **The job:** Spot expensive physical features and pre-compile the chosen variant.

## Task

A scene has many lights, and a product finish enables optional physical features. Return the count of enabled clearcoat, sheen, and transmission features before comparing a simpler material. Then call renderer.compileAsync after the lights and environment are set, returning its Promise.

| Function | Return |
| --- | --- |
| `enabledPhysicalFeatures(material: THREE.MeshPhysicalMaterial)` | How many optional physical shader features are enabled. |
| `precompileScene(renderer: Pick<THREE.WebGLRenderer, "compileAsync">, scene: THREE.Scene, camera: THREE.Camera)` | The Promise for shader compilation before first use. |

The preview reports enabled physical features for one material.

<div data-scene="practice"></div>

## Measure

Keep resolution and coverage fixed. Record frame time with optional physical features on and off. Then compare the first variant switch before and after `compileAsync`; record both times.

## Your code

Write it in `drills/2/optimization/shader-cost/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/shader-cost/apply-1
```

## The check

The test counts clearcoat, sheen, and transmission and checks the returned compile promise.

<details><summary>Hint</summary>

A physical material with zero optional features can be close in cost to StandardMaterial; first use can still compile a program.

</details>

## Where else?

What would you simplify for a mobile material fallback?

<details><summary>A few answers</summary> Disable unused physical features and precompile the chosen simpler variant before showing it. </details>
