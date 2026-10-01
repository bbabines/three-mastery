---
id: 4.transforms.normal-matrix.teach-back.1
loop: 4
tier: core
concepts: [transforms.normal-matrix]
mode: teach-back
context: transforms.normal-matrix/rim
lenses: []
misconceptions: []
---

# Normal matrix: explain the decision

> **The job:** restore a correct rim highlight after unevenly scaling a model.

## Task

A rim highlight leans after a model is stretched unevenly. Explain which normal should reach the lighting step and how to check it. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>The mesh normal starts in its local space.</li>
<li>Uneven scale makes a normal differ from an ordinary transformed direction.</li>
<li>Build a `Matrix3` normal matrix from the object's `matrixWorld` for world lighting.</li>
<li>Apply that matrix to the local normal and normalize it.</li>
<li>Check that the result is perpendicular to the transformed face edges before using it for a rim.</li>
</ol>
</div>

## Where else?

How would you prove a clicked marker’s world normal remains perpendicular after uneven scale?
