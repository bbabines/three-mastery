---
id: 4.debugging.nan-degenerate.teach-back.1
loop: 4
tier: light
concepts: [debugging.nan-degenerate]
mode: teach-back
context: debugging.nan-degenerate/exploded-geometry
lenses: []
misconceptions: []
---

# Degenerate inputs: explain the decision

> **The job:** keep a collapsed triangle from corrupting generated geometry.

## Task

A generated ribbon explodes when two drag handles coincide. Its code builds an edge direction and a triangle normal from the handles. Explain how to find the first invalid value and choose a safe result for a collapsed face. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Reproduce the case with coincident or nearly collinear handles and inspect the inputs before the geometry changes.</li>
<li>Check edge lengths and the cross product's length before dividing by either to make a direction or normal.</li>
<li>A zero vector has no direction; three.js returns zero when normalizing it, while custom division by zero can silently produce `NaN` or infinity.</li>
<li>Skip a collapsed face or use an explicit fallback normal rather than passing invalid values into the vertex buffer.</li>
<li>Check computed coordinates with `Number.isFinite` and trace the first invalid value back to its source.</li>
</ol>
</div>

## Where else?

What degenerate transform would you check if raycasts stopped hitting a mesh flattened to zero scale?
