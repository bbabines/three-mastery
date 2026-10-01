---
id: 2.debugging.shader-errors.apply.1
loop: 2
tier: light
concepts: [debugging.shader-errors, debugging.debug-views]
mode: apply
context: debugging.debug-views/depth-issues
lenses: []
misconceptions: []
---

# Shader errors: read the log and try debug views

> **The job:** Map a compiled shader line back to user code and choose a diagnostic material.

## Task

A shader compile log reports a line number in the injected source. Subtract the known injected prefix to get the authored line. Return a normal, depth, or wireframe material for a chosen debug view. A depth view helps distinguish a visibility problem from the compile error.

| Function | Return |
| --- | --- |
| `authoredShaderLine(log: string, injectedLines: number)` | The authored shader line, or −1 when the log has no line. |
| `debugViewMaterial(view: "normal" | "depth" | "wireframe")` | A material that reveals normals, depth, or mesh edges. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/debugging/shader-errors/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/debugging/shader-errors/apply-1
```

## The check

The tests check the behavior on more than one input, including the edge case described in the task. A function left unanswered fails.

<details><summary>Hint</summary>

Three.js injects shader code before yours, so the compiled line needs an offset.

</details>

## Where else?

Where else would the same code help? The concept card lists Typos, Precision errors.
