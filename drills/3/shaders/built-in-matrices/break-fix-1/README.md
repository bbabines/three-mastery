---
id: 3.shaders.built-in-matrices.break-and-fix.1
loop: 3
tier: core
concepts: [shaders.built-in-matrices]
mode: break-and-fix
context: shaders.built-in-matrices/rim-light
lenses: [space]
misconceptions: [shaders.built-in-matrices/world-normals]
---

# Built in matrices: remove an accidental rim-like highlight

> **The job:** Keep a world-lit surface from behaving like a camera-following rim light.

## Task

A surface lit by a fixed world light develops a rim-like highlight as the camera moves. The reported world normal rotates when only the camera changes. Repair `worldNormal`. The preview reports its output, and the test covers another input.

<div data-scene="preview"></div>

## Spaces

| Value | Space |
| --- | --- |
| input position or pixel | local space or device pixels, as named in the function |
| output | the space named in the return description |

## Your code

Fix `drills/3/shaders/built-in-matrices/break-fix-1/drill.ts`, write the cause in `cause.md`, then replace the placeholder in `check.ts` with a regression assertion.

```
npm run drill -- drills/3/shaders/built-in-matrices/break-fix-1
```

## The check

The acceptance test covers the symptom and a general case. Your check must reject the original bug and pass on the repair.

<details><summary>Hint</summary> Use the model matrix inverse transpose for world normals; normalMatrix includes view transformation. </details>

## Where else?

Would a rim light use the same normal space?

<details><summary>A few answers</summary> A rim test against the camera forward direction naturally uses view-space normals. </details>
