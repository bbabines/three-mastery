---
id: 4.rotation.quaternions.teach-back.1
loop: 4
tier: core
concepts: [rotation.quaternions]
mode: teach-back
context: rotation.quaternions/accumulating
lenses: []
misconceptions: []
---

# rotation.quaternions: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A model needs an extra turn around the world's up axis. Explain what the quaternion holds and why the order of applying this turn matters. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>A quaternion stores a rotation, not three angle components.</li>
<li>A delta can be applied in local or world space.</li>
<li>Prepending and appending a rotation have different effects.</li>
<li>Keep the quaternion normalized when accumulating many turns.</li>
<li>Compare the model's axes after the turn to verify the intended frame.</li>
</ol>
</div>

## Where else?

Where else would you need to explain this choice to someone reviewing code?
