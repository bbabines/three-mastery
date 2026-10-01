---
id: vfx.effects.dissolve.guided
elective: vfx
kind: guided
concepts: [vfx.value-noise, vfx.fbm, vfx.mask-compositing]
renderer: webgpu
---

# Dissolve a part away

> **The effect:** selecting a rack part starts a noisy dissolve. A warm rim follows the moving boundary until the part disappears.

## The scene

The left rack runs your `dissolveMaterial(progress)` from `electives/vfx/effects/dissolve/guided/drill.ts`; the right rack shows the reference. Click another part to restart. The viewer temporarily overrides the chosen part's materials, restores their exact shared references on deselection, and advances `progress` from 0 to 1.

<div data-effect="dissolveMaterial"></div>

## Step 1 · Make the breakup field

*From Value and gradient noise and fBm.* Sample `mx_noise_float(uv().mul(9))`, then map its signed value into zero-to-one. One broad sample creates large islands; a second weaker octave can roughen the edge. The same UV always gets the same noise value, so the boundary moves only because `progress` moves.

```js
const noise = mx_noise_float(uv().mul(9)).mul(0.5).add(0.5);
```

## Step 2 · Keep what has not dissolved

*From Mask remapping and compositing.* Compare noise against `progress`. At 0 nearly everything remains; at 1 nearly everything is gone. Use a short `smoothstep` band so the boundary does not shimmer as a hard binary edge.

```js
const remaining = smoothstep(progress.sub(0.08), progress.add(0.08), noise);
```

## Step 3 · Light the moving edge

The pixels whose noise is close to progress form the edge. Use `abs(noise.sub(progress))` for distance from it, turn that into a thin mask, and mix cool body color with warm edge color. Put the remaining mask and edge into `opacityNode`; set `transparent: true` and `depthWrite: false` so hidden pixels stop writing depth.

## Check it

- Clicking a part starts a visible breakup on that part, rather than a box around it.
- The warm edge follows the boundary; the body shrinks until it is gone.
- Changing selection restores the previous part's original finish, including shared materials.
- No opaque square or stale ghost remains after clearing selection.

Compare with the right rack. When every point holds, mark it done and then build it again from memory.

<div data-mark-done></div>
