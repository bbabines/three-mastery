---
id: 2.camera.clip-ndc-screen.implement.1
loop: 2
tier: core
concepts: [camera.clip-ndc-screen]
mode: implement
context: camera.clip-ndc-screen/pointer-ndc
lenses: [space]
misconceptions: [camera.clip-ndc-screen/ndc-y-down]
---

# NDC: place a screen label

> **The job:** Place an NDC point on a CSS pixel canvas.

## Task

Write `ndcToPixel(ndc, width, height)`. Return a new Vector3: X and Y are CSS pixels from the canvas’s top-left, while Z keeps the input NDC depth. NDC top-left (−1, +1) becomes pixel (0, 0). Leave `ndc` unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `ndc` | Normalized device coordinates |
| `width, height` | Canvas size in CSS pixels |
| Answer X/Y | CSS pixels from canvas top-left |
| Answer Z | Unchanged NDC depth |

## Your code

Write it in `drills/2/camera/clip-ndc-screen/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/clip-ndc-screen/implement-1

## The check

A quarter-right, half-down NDC point lands at the matching pixel, and the input remains unchanged.

<details><summary>Hint</summary>

The X range grows from [−1, +1] to [0, width]. Y needs the opposite direction.

</details>

## Where else?

Where else do projected points need CSS positions?

<details><summary>A few answers</summary>

Put a name tag over a part or place a screen-space selection handle.

</details>
