---
id: 4.scene-graph.world-bounds.teach-back.1
loop: 4
tier: core
concepts: [scene-graph.world-bounds]
mode: teach-back
context: scene-graph.world-bounds/camera-fit
lenses: []
misconceptions: []
---

# World bounds: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A camera should frame a product made of nested meshes. Explain which bounds to use and what can make the result loose or stale. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>A geometry bounding box describes only that geometry's local vertices.</li>
<li>`Box3.setFromObject` covers the object and its children in world space.</li>
<li>Hidden helpers and children can still affect those bounds.</li>
<li>Update world matrices before reading the bounds.</li>
<li>For a tighter fit under rotation, request precise bounds.</li>
</ol>
</div>

## Where else?

When could a cached bound miss a child moved by its parent?
