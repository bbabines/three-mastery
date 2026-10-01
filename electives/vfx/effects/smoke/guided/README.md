---
id: vfx.effects.smoke.guided
elective: vfx
kind: guided
concepts: [vfx.flipbooks, vfx.depth-effects, vfx.blending-modes]
renderer: webgpu
---

# Smoke puffs

> **The effect:** small smoke puffs rise near a selected part, change through an eight-frame atlas, and soften where they touch the floor.

## The scene

Write `smoke(part,camera)` in `electives/vfx/effects/smoke/guided/drill.ts`. It returns a group of planes, an update callback, and cleanup for the atlas it creates. The right rack runs the reference. The viewer swaps effects when selection changes.

<div data-effect="smoke"></div>

## Step 1 · Make an atlas

*From Flipbooks.* Draw eight radial puffs into a `CanvasTexture`: four columns and two rows. Each puff can grow and thin across the sequence. Canvas drawing uses a top-left image origin, so place the cells deliberately for the atlas UV's bottom-left origin. Set a color texture's `colorSpace` to `SRGBColorSpace`.

## Step 2 · Read one cell

Each plane holds a `frame` uniform. Find `column = mod(frame,4)` and `row = floor(frame/4)`, then sample with `(uv() + vec2(column,row)) / vec2(4,2)`. In `update(delta)`, advance age, choose one of frames 0–7, and move the plane gently upward. Copy the camera orientation so its face remains visible.

## Step 3 · Fade against the floor

*From Depth-based effects.* Sample `viewportDepthTexture()` and convert that depth with `perspectiveDepthToViewZ` before comparing it with `positionView.z`. Multiply the atlas opacity by the clamped gap divided by a short fade distance. The depth-effects page has the exact node expression. This pinned r186 repo uses that expression rather than its bundled `SoftParticles` add-on, which emits invalid GLSL on WebGL 2.

## Step 4 · Blend as smoke

*From Additive vs alpha blending.* Use normal alpha blending: smoke should soften and partly hide the scene, not add firelight. Make the material transparent with `depthWrite: false`, and multiply opacity by the puff's remaining life. Dispose the atlas when the old burst is replaced.

## Check it

- Several puffs rise under the selected part and change frames as they age.
- Their edges are soft, and the floor intersection fades rather than cutting a line.
- Smoke uses alpha, keeps its planes facing the camera, and leaves no square background.
- Changing selection releases the old atlas and starts fresh puffs.

Mark done after comparing with the right rack.

<div data-mark-done></div>
