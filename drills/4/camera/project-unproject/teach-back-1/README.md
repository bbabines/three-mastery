---
id: 4.camera.project-unproject.teach-back.1
loop: 4
tier: core
concepts: [camera.project-unproject]
mode: teach-back
context: camera.project-unproject/under-cursor
lenses: []
misconceptions: []
---

# Project and unproject: explain the decision

> **The job:** Explain how a pointer ray places a part on the floor.

## Task

A click should place a part under the cursor on a floor. Explain how screen coordinates become a world ray and why one projected point is not enough. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Map the pointer's canvas position to normalized device coordinates.</li>
<li>Unprojecting needs a chosen depth, so one screen position represents a line of possible world points.</li>
<li>A ray from the camera through that line can meet a chosen floor plane.</li>
<li>The ray and plane must use the same world space.</li>
<li>The camera matrices and canvas size must be current before building the ray.</li>
</ol>
</div>

## Where else?

How would you explain placing a hotspot on a wall rather than on the floor?
