---
id: 4.geometry.face-normals.teach-back.1
loop: 4
tier: core
concepts: [geometry.face-normals]
mode: teach-back
context: geometry.face-normals/back-face-test
lenses: []
misconceptions: []
---

# Face normals: explain the decision

> **The job:** Explain how a triangle's flat normal differs from smooth vertex normals.

## Task

A click gives a face normal for a sloped triangle. Explain where that normal comes from and how it differs from the smooth vertex normals. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>The triangle's corner order sets its front side.</li>
<li>The face normal points perpendicular to the triangle's edges.</li>
<li>Vertex normals can be averaged for smooth shading and need not match it.</li>
<li>`hit.face.normal` is in the mesh's local space.</li>
<li>Use the world normal matrix before comparing it with world directions.</li>
</ol>
</div>

## Where else?

How would you explain a marker that tilts away from a smooth surface?
