---
id: 4.camera.world-size-per-pixel.teach-back.1
loop: 4
tier: light
concepts: [camera.world-size-per-pixel]
mode: teach-back
context: camera.world-size-per-pixel/gizmo
lenses: [space]
misconceptions: [camera.world-size-per-pixel/constant-size]
---

# A constant-size gizmo: explain the scale

> **The job:** Explain how to keep a perspective gizmo 32 CSS pixels tall.

## Task

A perspective-camera gizmo should stay 32 CSS pixels tall as its selected part moves nearer or farther away. Explain how to choose its world height and when to update it. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

## Spaces

| Value | Space or unit |
| --- | --- |
| Gizmo position | World space |
| Depth | Distance along the camera-forward axis in view space |
| Target height | CSS pixels, paired with canvas CSS height |
| Resulting gizmo height | World units |

<div data-teach-back>
<ol>
<li>Use the gizmo's view depth along camera forward, not its straight-line distance from the camera.</li>
<li>At that depth, world units per CSS pixel equal `2 * depth * tan(verticalFov / 2) / canvas.clientHeight`.</li>
<li>Multiply by 32 to get the gizmo's world height at that depth.</li>
<li>Scale the gizmo again when its depth, the camera FOV, or the canvas CSS height changes.</li>
<li>Keep the pixel unit consistent: a device-pixel target needs a device-pixel canvas height.</li>
</ol>
</div>

## Where else?

How could the same world-units-per-pixel value help choose when a distant part switches LOD?
