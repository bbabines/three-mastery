---
id: vfx.effects.portal.guided
elective: vfx
kind: guided
concepts: [vfx.domain-warping]
renderer: webgpu
---

# Swirling portal or energy

> **The effect:** an energy disc under the selected part carries curved bright arms that keep flowing without moving the floor mesh.

## The scene

Write `portal(part,camera)` in `electives/vfx/effects/portal/guided/drill.ts`. Return one flat effect object. The viewer places and frees it when selection changes; the right rack shows the reference.

<div data-effect="portal"></div>

## Step 1 · Place a disc

Use world `Box3` bounds to find the part's floor footprint. Put a plane just above y = 0 so it does not fight the floor for the same depth. Scale it from the wider X/Z bound; thin parts still need a visible minimum disc.

## Step 2 · Make a swirling coordinate field

*From Domain warping and curl noise.* Import `curlNoise` from `three/addons/tsl/math/curlNoise.js`. Feed it a three-dimensional coordinate built from the plane's UV and a slowly changing time coordinate. Use its X/Y components as a small offset before measuring the circle. This is a flow direction, not a grayscale texture pasted on top.

## Step 3 · Reveal curved arms

Measure radius with `length(p)` and angle with `atan(p.y,p.x)`. A sine of several turns of angle minus a multiple of radius makes curved arms. Keep a soft inner hole and outer edge with `smoothstep`; multiply the disc by the arms and a dim floor glow between them. Use an additive material with `depthWrite: false`.

## Check it

- Clicking different parts moves and sizes the portal under each footprint.
- Bright arms bend and continue to flow; the geometry stays flat on the floor.
- Its center and outside fade softly, with no visible rectangle or floor flicker.
- Changing selection removes the old disc and frees its material and geometry.

Mark done after comparing with the right rack.

<div data-mark-done></div>
