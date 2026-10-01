---
id: 4.math.triple-product.teach-back.1
loop: 4
tier: light
concepts: [math.triple-product]
mode: teach-back
context: math.triple-product/mirrored-basis
lenses: []
misconceptions: [math.triple-product/handedness]
---

# Detect a mirrored basis: explain the sign

> **The job:** explain a real 3D decision in five plain sentences.

## Task

An imported model supplies three basis axes before its transform is baked into geometry. Explain how to tell whether those axes form a mirrored basis and why the sign matters to the resulting mesh. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Express the ordered X, Y, and Z basis axes in the same coordinate space.</li>
<li>Compute the scalar triple product `x.dot(y.clone().cross(z))`.</li>
<li>A positive sign is right-handed and a negative sign is mirrored for that axis order.</li>
<li>A value near zero signals a degenerate basis, where the sign is unreliable.</li>
<li>When baking a mirrored transform, account for reversed triangle winding and the affected normals.</li>
</ol>
</div>

## Where else?

How could a triple product give the signed volume of a tetrahedron?
