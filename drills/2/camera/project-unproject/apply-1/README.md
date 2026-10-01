---
id: 2.camera.project-unproject.apply.1
loop: 2
tier: core
concepts: [camera.project-unproject]
mode: apply
context: camera.project-unproject/build-ray
lenses: [space]
misconceptions: [camera.project-unproject/behind-camera]
---

# Unproject: choose a screen depth

> **The job:** Find a world point at an NDC spot.

## Task

Write `pointAtNdcDepth(camera, x, y, depth)`. X, Y, and depth are NDC values; depth is not a world distance. Return the world point that projects back to those three values after the camera moves or turns. Leave the camera unchanged.

Save your code and inspect the scene; compare the blue result with the green reference.

<div data-scene="demo"></div>

## Spaces

| Value | Space or units |
| --- | --- |
| `camera` | Pose in the world; lens |
| `x, y, depth` | NDC coordinates |
| Answer | World position |

## Your code

Write it in `drills/2/camera/project-unproject/apply-1/drill.ts`. Save to update the scene. Check it with:

    npm run drill -- drills/2/camera/project-unproject/apply-1

## The check

Points at several NDC depths project back to the requested X, Y, and Z with a moved and turned camera.

<details><summary>Hint</summary>

One screen X/Y describes a line of possible world points. Include an NDC depth before unprojecting.

</details>

## Where else?

Where else do you choose a depth before unprojecting?

<details><summary>A few answers</summary>

Find a point on a drag plane or start a ray through the pointer.

</details>
