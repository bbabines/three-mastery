---
id: 4.assets.preload-lazy.teach-back.1
loop: 4
tier: light
concepts: [assets.preload-lazy]
mode: teach-back
context: assets.preload-lazy/priority
lenses: [cost]
misconceptions: [assets.preload-lazy/preload-everything]
---

# Preload or wait: explain the priority

> **The job:** prioritize the base model, a likely next finish, and off-screen catalog assets.

## Task

A product page needs its base model immediately, one likely next finish, and six catalog models that are off screen. Explain which asset gets priority, what to preload after the first view, and what to leave lazy. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

## Measure

Compare bytes downloaded before the first usable view and the wait from selecting the next finish to its first rendered frame. Also watch retained GPU memory after preloading; do not turn a timing measurement into a pass threshold.

<div data-teach-back>
<ol>
<li>Load the base model first so the first useful view is not held behind optional models.</li>
<li>Preload the likely next finish after the first view if avoiding its first-use wait is valuable.</li>
<li>Leave the off-screen catalog models lazy until selection or an imminent need.</li>
<li>Preloading spends download, decode, upload, and retained memory before the user asks for the asset.</li>
<li>Check both startup cost and first-use wait with the real assets before changing the priority order.</li>
</ol>
</div>

## Where else?

If catalog models become visible as the user scrolls, when would you start their loads?
