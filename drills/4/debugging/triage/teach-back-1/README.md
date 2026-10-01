---
id: 4.debugging.triage.teach-back.1
loop: 4
tier: core
concepts: [debugging.triage]
mode: teach-back
context: debugging.triage/wrong-color
lenses: []
misconceptions: []
---

# Debugging triage: explain the decision

> **The job:** trace a wrong finish color through the viewer before changing its shader.

## Task

A product viewer loads a variant, but its finish has the wrong color. Explain how to narrow the cause before rewriting the shader. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>First decide whether the fault is transform, geometry, material, camera, or pipeline.</li>
<li>Use a simple known material to check whether geometry and camera still show the part correctly.</li>
<li>Check the assigned material, texture, and lighting before blaming the shader.</li>
<li>Inspect the input color and an intermediate output to separate a map problem from an output pipeline problem.</li>
<li>Change one variable and compare against the original symptom.</li>
</ol>
</div>

## Where else?

How would the first checks change if the variant were missing entirely?
