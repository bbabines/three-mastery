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

# camera.project unproject: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

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

Where else would you need to explain this choice to someone reviewing code?
