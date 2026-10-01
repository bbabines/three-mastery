---
id: vfx.effects.shield.guided
elective: vfx
kind: guided
concepts: [vfx.cellular-noise, vfx.uv-animation, vfx.depth-effects]
renderer: webgpu
---

# Shield or highlight shell

> **The effect:** a blue cellular shell hugs the selected part, with veins that drift and soften where the shell meets other geometry.

## The scene

Write `shield(part,camera)` in `electives/vfx/effects/shield/guided/drill.ts`. Return a shell object; the viewer handles selection and cleanup. The right rack shows the reference around the same chosen part.

<div data-effect="shield"></div>

## Step 1 · Fit the shell

Measure the selected part in world space with `Box3.setFromObject(part)`. Put a box shell at its center and make each side slightly larger than the matching bound, with a small minimum for thin parts. A single bounding sphere around a long crossbar would float far from most of it.

## Step 2 · Draw moving cells

*From Cellular noise and UV animation.* Sample `mx_worley_noise_float_2d` on scaled UVs. A narrow band near one distance makes bright veins between cells. Add a wrapped time offset to the UV before sampling, so the veins drift without rotating the mesh and without an ever-growing float phase.

## Step 3 · Soften intersections

*From Depth-based effects.* Compare opaque scene depth and the shell's own view-space depth. Multiply the vein opacity by a fade near contact. Use `transparent: true` and `depthWrite: false`; additive blue makes this a highlight, while the cell mask leaves most of the shell clear.

## Check it

- The shell is centered on every selected part and clears on deselection.
- Cells move over its surface; the whole shell does not rotate to fake that motion.
- Contact with the rack softens; no hard blue sheet hides the part.
- The shell adds light without writing depth or leaving a ghost after another selection.

Mark done after comparing with the right rack.

<div data-mark-done></div>
