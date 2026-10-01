---
id: 4.debugging.debug-views.teach-back.1
loop: 4
tier: light
concepts: [debugging.debug-views]
mode: teach-back
context: debugging.debug-views/uv-stretching
lenses: []
misconceptions: []
---

# Debug views: explain the decision

> **The job:** explain how a debug view can expose stretched UVs.

## Task

A label looks stretched on one side of an imported product. Explain which temporary views would show whether the UV layout, mesh, or lighting caused it, and what you would look for. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Show a checker or UV-coordinate view so the texture layout is visible without the product's lighting.</li>
<li>Uneven checker size or stretched squares point to uneven UV scale or distortion.</li>
<li>Compare the change with UV seams; a sudden jump at a seam can come from the UV layout.</li>
<li>Use wireframe to see whether the distortion follows triangles or a damaged mesh instead.</li>
<li>Switch debug views off before measuring performance; wireframe and helpers can add drawing work.</li>
</ol>
</div>

## Where else?

Which temporary view would help you decide whether two surfaces overlap and cause a depth artifact?
