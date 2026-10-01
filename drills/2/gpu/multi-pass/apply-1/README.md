---
id: 2.gpu.multi-pass.apply.1
loop: 2
tier: core
concepts: [gpu.multi-pass]
mode: apply
context: gpu.multi-pass/fxaa
lenses: [cost]
misconceptions: []
---

# Post: finish with output conversion

> **The job:** Put the output conversion after all effect passes.

## Task

Given a list of effect pass names, return a new list with one `output` pass last. Remove an earlier output pass so tone mapping and color conversion run only at the end. Do not change the input list.

| Function | Return |
| --- | --- |
| `outputLast(passes: string[])` | Effect passes followed by exactly one final output pass. |

The effect chain should end with exactly one output pass, even when the starting list includes one too early.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/multi-pass/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/multi-pass/apply-1
```

## The check

The check verifies that the code moves a premature output pass to the end without mutating the list. It also rejects an unanswered function.

<details><summary>Hint</summary>

EffectComposer needs OutputPass last for tone mapping and sRGB output.

</details>

## Where else?

What does a second full-screen effect add at twice the canvas width and height?
