---
id: 4.optimization.leak-detection.teach-back.1
loop: 4
tier: core
concepts: [optimization.leak-detection]
mode: teach-back
context: optimization.leak-detection/spa-routes
lenses: []
misconceptions: []
---

# Leak detection: explain the decision

> **The job:** explain a real 3D decision in five plain sentences.

## Task

A viewer slows after entering and leaving the product route many times. Explain a repeatable check for resources retained across route changes and one limit of the counters. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Take a baseline after the first rendering warm-up.</li>
<li>Run the same load and unload cycle many times.</li>
<li>Dispose owned resources each cycle and keep shared ones.</li>
<li>Geometry and texture counts should return near the baseline.</li>
<li>`renderer.info.memory` does not directly count materials, so inspect programs or disposal events too.</li>
</ol>
</div>

## Where else?

How would the same baseline check reveal a leak during finish swaps?
