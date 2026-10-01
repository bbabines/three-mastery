---
id: 4.gpu.measurement.teach-back.1
loop: 4
tier: core
concepts: [gpu.measurement]
mode: teach-back
context: gpu.measurement/spector
lenses: []
misconceptions: []
---

# GPU measurement: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A scene stutters on one device. Explain what draw counts, JavaScript timing, and GPU timing can each tell you before changing code. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>`renderer.info` counts work such as calls and triangles but does not time it.</li>
<li>A JavaScript stopwatch around `render` mostly sees submission work.</li>
<li>GPU timing or a browser profiler is needed to see GPU work.</li>
<li>Measure the same scene and device before and after one change.</li>
<li>Frame time varies, so use repeated observations instead of one pass mark.</li>
</ol>
</div>

## Where else?

How would you compare a draw-call bottleneck with a fill-rate bottleneck?
