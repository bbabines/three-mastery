---
id: 4.queries.ray-plane.teach-back.1
loop: 4
tier: core
concepts: [queries.ray-plane]
mode: teach-back
context: queries.ray-plane/measuring
lenses: []
misconceptions: []
---

# Ray and plane: explain the decision

> **The job:** find where a pointer ray meets a plane and handle a parallel ray.

## Task

A pointer ray is used to place a part on an endless floor. Explain when it gives a hit, what space the answer is in, and when there is no answer. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>The ray and plane must be described in the same space.</li>
<li>`ray.intersectPlane` returns a point on the plane or `null`.</li>
<li>A parallel ray may never meet the plane.</li>
<li>A plane behind the ray's origin is not a forward hit.</li>
<li>The hit point alone may not be the dragged object's position.</li>
</ol>
</div>

## Where else?

What happens when the pointer ray runs parallel to a placement wall?
