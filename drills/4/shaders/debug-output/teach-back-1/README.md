---
id: 4.shaders.debug-output.teach-back.1
loop: 4
tier: core
concepts: [shaders.debug-output]
mode: teach-back
context: shaders.debug-output/uv-seams
lenses: []
misconceptions: []
---

# Shader debug output: explain the decision

> **The job:** use shader output colors to locate a UV jump at a texture seam.

## Task

A texture breaks at a seam. Explain how to use a temporary shader color output to find where UV coordinates jump. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>A shader can write an intermediate value as color for inspection.</li>
<li>Map the UV's two components into red and green channels.</li>
<li>A visible jump can reveal a UV seam or unexpected wrap.</li>
<li>The same world point can have different UV values on neighboring triangles.</li>
<li>Compare the debug colors before changing the texture or lighting.</li>
</ol>
</div>

## Where else?

How would a temporary normal-as-color output help distinguish a UV seam from a lighting seam?
