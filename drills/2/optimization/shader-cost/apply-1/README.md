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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Run the Domain 10 shader-swap experiment at fixed resolution and coverage. Record frame time for the enabled physical features and the simpler material. Then compare first-use hitch before and after compileAsync; note both measured frame times, without imposing a device-independent threshold.

## Your code

Write it in `drills/2/optimization/shader-cost/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/optimization/shader-cost/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

A physical material with zero optional features can be close in cost to StandardMaterial; first use can still compile a program.

</details>

## Where else?

Where else would the same code help? The concept card lists Mobile fallback, Shadow cost.
