---
id: 4.geometry.updating-buffers.teach-back.1
loop: 4
tier: light
concepts: [geometry.updating-buffers]
mode: teach-back
context: geometry.updating-buffers/vertex-highlight
lenses: [cost]
misconceptions: [geometry.updating-buffers/array-updates-gpu]
---

# Highlight one vertex: explain the upload

> **The job:** Explain how an edited vertex color reaches the GPU.

## Task

The user selects one vertex of an already rendered mesh. Its color attribute changes in JavaScript, but the vertex stays gray. Explain how to make the highlight appear without rebuilding the geometry each frame. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

## Measure

Record the number of color-attribute components uploaded for a full resend versus the selected vertex's update range, and measure CPU edit time. A measurement helps compare approaches; it is not a pass threshold.

<div data-teach-back>
<ol>
<li>Ensure the geometry has a color attribute and the material uses vertex colors.</li>
<li>Change the selected vertex's color components in the CPU-side attribute.</li>
<li>Set that attribute's `needsUpdate` so the GPU receives the edit.</li>
<li>Mark only the changed components with `addUpdateRange` when a narrow upload matters.</li>
<li>Keep the existing geometry and attribute; rebuilding them for each selection adds avoidable allocation and upload work.</li>
</ol>
</div>

## Where else?

How would the update strategy change if a progressive reveal modified hundreds of adjacent vertices at once?
