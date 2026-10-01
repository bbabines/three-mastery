---
id: vfx.effects.dissolve.from-memory
elective: vfx
kind: from-memory
concepts: [vfx.value-noise, vfx.fbm, vfx.mask-compositing]
renderer: webgpu
---

# Dissolve a part away · from memory

Build the selected part's noisy dissolve in `electives/vfx/effects/dissolve/from-memory/drill.ts`. Only `dissolveMaterial(progress)` is missing. The viewer owns the temporary material swap and restores the part on deselection. Match the right rack by eye.

<div data-effect="dissolveMaterial"></div>

## Checklist

- The selected part itself disappears as a stable noise boundary advances from 0 to 1.
- A narrow warm edge travels with the boundary; the rest fades out.
- Another selection starts again, and clearing selection leaves no effect behind.
- Original shared materials survive the temporary override.

Use three.js docs and source; leave the guided steps and `/solutions` closed. Mark done when the effect matches.

<div data-mark-done></div>
