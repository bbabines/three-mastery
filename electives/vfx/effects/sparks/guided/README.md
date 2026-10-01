---
id: vfx.effects.sparks.guided
elective: vfx
kind: guided
concepts: [vfx.particles, vfx.integration-forces, vfx.sprite-facing]
renderer: webgpu
---

# Sparks when a part snaps in

> **The effect:** clicking a rack part sends a short burst of glowing streaks from its center, like hardware snapping into place.

## The scene

Write `sparks(part, camera)` in `electives/vfx/effects/sparks/guided/drill.ts`. The hook returns an object plus an `update(delta)` function. The viewer adds the object, calls the update every frame, and frees it when selection changes. The right rack repeats its short reference burst so you can inspect it after opening the page.

<div data-effect="sparks"></div>

## Step 1 · Spawn a bounded burst

*From Particle fundamentals.* Find the part's current world center with `new THREE.Box3().setFromObject(part).getCenter(...)`. Build a small `Group` of about twelve narrow planes there. Reuse one small count: more transparent planes cover more pixels, even when each is cheap.

Give each streak an outward velocity and an age of zero. Distinct angles keep the burst from becoming one line. A `MeshBasicNodeMaterial` with `AdditiveBlending`, `transparent: true`, and `depthWrite: false` lets warm light build up without opaque rectangles.

## Step 2 · Move by the new velocity

*From Integration and forces.* In `update(delta)`, cap a rare long frame, add downward acceleration to each velocity, then add the **new** velocity times `delta` to its position. Let opacity fall as `age / lifetime` approaches one. A fixed move per frame would run at different speeds on different displays.

## Step 3 · Face and align the streaks

*From Sprite facing.* Copy the camera's orientation onto each small plane so it can be seen. Project its velocity onto camera-right and camera-up, then rotate the plane within that view so its long axis follows motion. A flat streak aimed only at world up will look wrong when you orbit.

## Check it

- Clicking a part starts a burst from its actual center, including high or thin parts.
- The streaks spread, fall under gravity, and fade rather than living forever.
- They face the camera while their long axes follow movement.
- The glow adds light and does not leave opaque rectangles; selecting another part starts a fresh burst.

Mark done after matching the right rack by eye.

<div data-mark-done></div>
