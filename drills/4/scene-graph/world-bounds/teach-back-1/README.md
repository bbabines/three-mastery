---
id: 4.scene-graph.world-bounds.teach-back.1
loop: 4
tier: core
concepts: [scene-graph.world-bounds]
mode: teach-back
context: scene-graph.world-bounds/floor-placement
lenses: []
misconceptions: []
---

# World bounds: explain the decision

> **The job:** place a nested, rotated product on the floor using current world bounds.

## Task

A nested product should rest on the floor without sinking a rotated child into it. Explain which world bounds to measure, how to use their bottom edge, and what can make the result loose or stale. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>A geometry bounding box describes only that geometry's local vertices.</li>
<li>`Box3.setFromObject` covers the object and its children in world space.</li>
<li>Hidden helpers and children can still affect those bounds.</li>
<li>Update world matrices before reading the bounds.</li>
<li>Move the product by the difference between floor height and `bounds.min.y`; request precise bounds if rotation makes the box too loose.</li>
</ol>
</div>

## Where else?

When should floor placement recalculate a child's world bounds?
