---
id: 4.math.projection-rejection.teach-back.1
loop: 4
tier: core
concepts: [math.projection-rejection]
mode: teach-back
context: math.projection-rejection/closest-point-line
lenses: []
misconceptions: []
---

# Projection and rejection: explain the decision

> **The job:** snap a clicked point to a guide line and describe its remaining offset.

## Task

A clicked point should snap to the nearest point on a guide line. Explain how projection finds that point and how rejection describes the remaining offset. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Choose a point on the line and a nonzero direction in the same space.</li>
<li>Subtract the line point from the clicked point to get its offset.</li>
<li>Project that offset onto the line direction.</li>
<li>Add the line point back to get the closest point.</li>
<li>The rejected offset is perpendicular to the line; keep the caller’s inputs unchanged.</li>
</ol>
</div>

## Where else?

How would the same projection keep only motion up a sloping rail?
