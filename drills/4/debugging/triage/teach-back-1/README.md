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

# debugging.triage: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A product suddenly looks washed out. Explain how to narrow the cause before rewriting the shader. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>First decide whether the fault is transform, geometry, material, camera, or pipeline.</li>
<li>Use a simple known material to isolate material from geometry and camera.</li>
<li>Check texture color space and tone mapping for a color problem.</li>
<li>Inspect actual inputs and intermediate outputs before changing many settings.</li>
<li>Change one variable and compare against the original symptom.</li>
</ol>
</div>

## Where else?

Where else would you need to explain this choice to someone reviewing code?
