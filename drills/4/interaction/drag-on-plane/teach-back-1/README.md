---
id: 4.interaction.drag-on-plane.teach-back.1
loop: 4
tier: core
concepts: [interaction.drag-on-plane]
mode: teach-back
context: interaction.drag-on-plane/wall-drag
lenses: []
misconceptions: []
---

# interaction.drag on plane: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A grabbed handle should follow the cursor across a wall without snapping its origin to the cursor. Explain the start and move steps. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Choose a drag plane through the grabbed point.</li>
<li>On each pointer move, intersect the new ray with that plane.</li>
<li>At drag start, save the offset between the object origin and the hit.</li>
<li>Apply that offset to each later hit.</li>
<li>Keep both the hit and offset in the same coordinate space.</li>
</ol>
</div>

## Where else?

Where else would you need to explain this choice to someone reviewing code?
