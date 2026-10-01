---
id: 4.debugging.helpers.teach-back.1
loop: 4
tier: light
concepts: [debugging.helpers]
mode: teach-back
context: debugging.helpers/bounds
lenses: []
misconceptions: []
---

# Helpers: explain the decision

> **The job:** use a visible box to inspect a product's bounds.

## Task

A grouped product rotates, but its selection box still appears to cover the old pose. Explain how to display and refresh a bounds helper, where to put it in the scene, and what extra objects it might reveal. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Create a `BoxHelper` for the product group and add the helper to the scene, not under the moved group.</li>
<li>Update the group's world matrices after movement, then update the helper so its lines reflect the new world bounds.</li>
<li>Compare the box with the visible product to find children or hidden objects that unexpectedly widen it.</li>
<li>The helper displays a world-space box; nesting it under the moving group would transform its lines again.</li>
<li>Hide or remove the helper before raycasting or measuring draw calls, because helpers can add hits and rendering work.</li>
</ol>
</div>

## Where else?

How would you show a rotated part's local axes without treating them as world axes?
