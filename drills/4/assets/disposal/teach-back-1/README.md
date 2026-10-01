---
id: 4.assets.disposal.teach-back.1
loop: 4
tier: core
concepts: [assets.disposal]
mode: teach-back
context: assets.disposal/long-sessions
lenses: []
misconceptions: []
---

# Disposal ownership: explain the decision

> **The job:** release old finish resources without breaking a shared texture.

## Task

A product viewer swaps finishes repeatedly. Explain what gets freed, what stays shared, and how you would catch a leak. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Removing an object from the scene does not free GPU resources.</li>
<li>Dispose an owned geometry, material, or texture when nothing else uses it.</li>
<li>Do not dispose a resource still shared by another visible part.</li>
<li>Repeat the swap and compare resource counts after the first warm-up.</li>
<li>A steady upward count after each cycle is evidence of a leak.</li>
</ol>
</div>

## Where else?

How would you explain cleanup when two finish variants share one map?
