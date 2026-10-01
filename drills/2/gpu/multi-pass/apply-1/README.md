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

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Measure

Use `performance.now()` around CPU work, or `renderer.info` and Chrome Performance for rendering. Write down the measured value for the scene; frame time changes by device, so it is not a pass bar.

## Your code

Write it in `drills/2/gpu/multi-pass/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/gpu/multi-pass/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

EffectComposer needs OutputPass last for tone mapping and sRGB output.

</details>

## Where else?

Where else would the same code help? The concept card lists Selection outline, Bloom.
