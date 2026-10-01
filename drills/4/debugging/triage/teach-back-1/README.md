---
id: 4.debugging.triage.teach-back.1
loop: 4
tier: core
concepts: [debugging.triage]
mode: teach-back
context: debugging.triage/black-screen
lenses: []
misconceptions: []
---

# Debugging triage: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A product viewer suddenly shows a black canvas after loading a variant. Explain how to narrow the cause before rewriting the shader. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>First decide whether the fault is transform, geometry, material, camera, or pipeline.</li>
<li>Use a simple known material to isolate material from geometry and camera.</li>
<li>Check camera bounds, lighting, and material inputs before blaming the shader.</li>
<li>Inspect actual inputs and intermediate outputs before changing many settings.</li>
<li>Change one variable and compare against the original symptom.</li>
</ol>
</div>

## Where else?

How would you narrow a black material before changing its shader?
