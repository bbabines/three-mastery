---
id: 3.materials.environment-maps.break-and-fix.1
loop: 3
tier: core
concepts: [materials.environment-maps]
mode: break-and-fix
context: materials.environment-maps/env-vs-background
lenses: []
misconceptions: [materials.environment-maps/just-background]
---

# Environment maps: repair the preview

> **The job:** Give chrome reflections independent of the visible backdrop.

## Task

The sky is visible behind the chrome, but the metal reflects black. Repair `chromeStage`. Keep unrelated settings intact and watch the readout change.

<div data-scene="preview"></div>

## Your code

Fix `drills/3/materials/environment-maps/break-fix-1/drill.ts`, then write the cause in `cause.md` and a short regression assertion in `check.ts`.

```
npm run drill -- drills/3/materials/environment-maps/break-fix-1
```

## The check

The acceptance test covers the symptom and a second input. Your regression check must fail on the original code and pass after repair.

<details><summary>Hint</summary> `scene.background` and `scene.environment` are separate inputs. </details>

## Where else?

What happens when several products share a studio environment?

<details><summary>A few answers</summary> Their metal reflections remain consistent across different backdrops. </details>
