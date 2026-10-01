---
id: 4.scene-graph.material-override.teach-back.1
loop: 4
tier: light
concepts: [scene-graph.material-override]
mode: teach-back
context: scene-graph.material-override/highlight
lenses: []
misconceptions: [scene-graph.material-override/auto-restore]
---

# Temporary highlight: explain the restore

> **The job:** highlight one selected mesh and restore its exact shared material.

## Task

Selecting a mesh should show a temporary highlight material, then clearing selection should restore its exact previous appearance. Several meshes share their original material. Explain how to swap and restore safely. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Save the selected mesh's exact original material reference before changing it.</li>
<li>Assign a separate highlight material instead of mutating an original shared material.</li>
<li>Keep the saved reference associated with that mesh while the override is active.</li>
<li>Restore that exact reference when selection clears; three.js does not remember it for you.</li>
<li>Dispose a temporary material only when no mesh uses it, and leave the shared original material alive.</li>
</ol>
</div>

## Where else?

How would you keep and restore each mesh's material when a whole assembly enters x-ray mode?
