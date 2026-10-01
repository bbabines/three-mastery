---
id: 2.camera.project-unproject.implement.1
loop: 2
tier: core
concepts: [camera.project-unproject]
mode: implement
context: camera.project-unproject/under-cursor
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# Project: place a label

> **The job:** Place a world marker on a CSS pixel canvas.

## Task

Write `labelPosition(camera, worldPoint, width, height)`. Project the world point through the current camera and return a new Vector3. Its X/Y are CSS pixels from the canvas top-left; Z keeps NDC depth for off-screen checks. Leave the world point unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in the world; lens |
| `worldPoint` | World position |
| `width, height` | Canvas size in CSS pixels |
| Answer X/Y | CSS pixels |
| Answer Z | NDC depth |

## Your code

Write it in `drills/2/camera/project-unproject/implement-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/project-unproject/implement-1

## The check

The label position follows a moved camera and maps back to the original world point; the input stays unchanged.

<details><summary>Hint</summary>

Projection gives NDC first. Convert only X/Y to top-left CSS pixels and preserve Z.

</details>

## Where else?

Where else would this projection be useful?

<details><summary>A few answers</summary>

Anchor a tooltip to a part or place an edge-of-screen indicator.

</details>
