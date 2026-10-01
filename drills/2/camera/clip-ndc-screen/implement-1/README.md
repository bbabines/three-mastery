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

# Clip, NDC, screen: place a projected ndc point on a css pixel canvas, flipping the vertical direction to match the page

> **The job:** Place a projected NDC point on a CSS pixel canvas, flipping the vertical direction to match the page.

## Task

Place a projected NDC point on a CSS pixel canvas, flipping the vertical direction to match the page.

Write `ndcToPixel(ndc, width, height)` for the behavior above. Save the starter to update the scene.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `ndc` | Normalized device coordinates |
| `width` | CSS pixels |
| `height` | CSS pixels |
| Answer | CSS pixels, with NDC depth where stated |

## Your code

Write it in `drills/2/camera/clip-ndc-screen/implement-1/drill.ts`. Check it with:

    npm run drill -- drills/2/camera/clip-ndc-screen/implement-1

## The check

It passes when `ndcToPixel` does the stated job for the scene and the other cases in the test. The test exercises the values and spaces named above.

<details><summary>Hint</summary>

Use the method from the clip, ndc, screen page, and check which space the result belongs to.

</details>

## Where else?

Where else would the same operation help when a part moves or turns?

<details><summary>A few answers</summary>

World point to label position. Off-screen test.

</details>
