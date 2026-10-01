---
id: 4.math.lerp.teach-back.1
loop: 4
tier: light
concepts: [math.lerp]
mode: teach-back
context: math.lerp/colors
lenses: []
misconceptions: [math.lerp/t-in-range]
---

# Blend two colors: explain the fraction

> **The job:** blend blue and amber with a slider while preserving both endpoint colors.

## Task

A slider from 0 to 1 blends a product from blue to amber. Explain what the fraction means, how to avoid changing the saved endpoint colors, and what to do if the slider sends an out-of-range value. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

<div data-teach-back>
<ol>
<li>Use blue as the start color and amber as the end color in the same working color space.</li>
<li>At `t = 0` the result is blue, at `t = 1` it is amber, and values between blend them.</li>
<li>Clone the start color before calling `Color.lerp`, because it changes its receiver.</li>
<li>Clamp a slider value to 0–1 if the product must stay between the endpoint colors; outside that range, lerp extrapolates.</li>
<li>Apply the resulting color to the displayed material when the slider changes.</li>
</ol>
</div>

## Where else?

How would the same fraction blend between two animation weights?
