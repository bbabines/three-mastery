---
id: vfx.effects.selection-ring.guided
elective: vfx
kind: guided
concepts: [vfx.sdf, vfx.uv-animation, vfx.blending-modes]
renderer: webgpu
---

# Selection ring under a clicked part

> **The effect:** click a part of the rack, and a glowing ring appears on the floor under it, with dashes spinning around it. It's the marker a product viewer or a strategy game puts under whatever you've selected.

## The scene

This is the product viewer you'll build into: your rack twice, on a floor. Clicking a part selects it on both racks. The right rack runs the reference ring. The left rack runs yours, from `electives/vfx/effects/selection-ring/guided/drill.ts`, so until you write it, clicking shows nothing there.

<div data-effect="selectionRing"></div>

Open `drill.ts`. The wiring, `effect`, is already done: whenever the selection changes, it takes the old ring out of the scene, frees its GPU memory with `disposeObject` (taking an object out of the scene frees nothing on its own), and adds whatever your hook returns. Your hook is `selectionRing(part)`. It gets the selected part and returns the ring to put under it, or `null` for no ring. The floor is at y = 0.

Save after each step. The page reloads, and the left rack shows what you have so far. The TSL functions below all come from `'three/tsl'`.

## Step 1 · Measure the part

*From the World-space bounds page in Domain 7.*

```js
const bounds = new THREE.Box3().setFromObject(part);
const center = bounds.getCenter(new THREE.Vector3());
const size = bounds.getSize(new THREE.Vector3());
const radius = Math.max(size.x, size.z) * 0.6 + 0.12;
```

`Box3.setFromObject` gives the box around the part and everything inside it, in the world. The viewer refreshes the world matrices before it calls your hook, so the box is current. Only the footprint matters on the floor, the box's size along x and z, so the radius comes from the longer of those two, with a margin. The margin keeps a ring around thin parts, like the upright tube, big enough to see.

## Step 2 · The ring mask

*From the Signed distance fields page.*

```js
const RING_RADIUS = 0.4; // in the square's UV: the square is 1 across
const RING_WIDTH = 0.07;

const p = uv().sub(0.5);
const d = length(p).sub(RING_RADIUS);
const ring = oneMinus(smoothstep(0, RING_WIDTH, abs(d)));
```

This is the soft ring from the distance fields exercise, with fixed numbers. The ring sits at 0.4 from the middle, so its soft edge, which reaches 0.07 farther, stays inside the square. Step 5 scales the square to fit the part, so these numbers never change.

## Step 3 · Dashes that spin

*From the UV animation page, which isn't built yet. This step teaches just enough to finish.*

A point can be described by its angle around the middle and its distance from the middle, instead of by how far across and up it is. Those two are its **polar coordinates**. The ring's distance from the middle is already `length(p)`. The angle comes from `atan(p.y, p.x)`, which runs from −π to π once around (in radians, where half a turn is π). Dividing by `TWO_PI` makes it −0.5 to 0.5: one unit for one full turn.

```js
const around = atan(p.y, p.x).div(TWO_PI);            // −0.5 to 0.5, once around
const spin = fract(time.mul(0.15));                    // 0 to 1, over and over: 0.15 turns a second
const segment = fract(around.add(spin).mul(12));       // 0 to 1 across each of 12 segments
const dashes = oneMinus(smoothstep(0.2, 0.3, abs(segment.sub(0.5))));
```

- Adding to the angle turns the pattern, the way turning a dial moves its marks. Adding a number that grows with time makes it spin. `time` is the seconds since the renderer started.
- `fract` keeps only the part after the decimal point, so 2.7 becomes 0.7. Wrapping time with it keeps the number small. Raw `time` keeps growing, and after the page has been open for hours a float can't hold it precisely, so the motion starts to stutter.
- Multiplying by 12 gives 12 segments, and `fract` restarts at 0 in each one. Use a whole number: where the angle jumps from 0.5 back to −0.5, on the ring's left side, a whole number of segments hides the jump, and 11.5 would leave a seam.
- `abs(segment.sub(0.5))` is 0 in the middle of each segment and 0.5 at its ends. The smoothstep keeps the middle part, with soft edges: that's one dash.

## Step 4 · Make it glow

*From the Additive vs alpha blending page, which isn't built yet. This step teaches just enough to finish.*

```js
const material = new THREE.MeshBasicNodeMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
material.colorNode = color(0x38bdf8).mul(ring.mul(dashes.mul(0.75).add(0.25)));
```

- **Additive blending** adds the ring's color onto whatever is already drawn behind it. Black adds nothing, so the rest of the square disappears without any transparency setting, and the ring can only brighten the floor, never darken it. Glows, sparks, and fire use it for the same reason.
- **`depthWrite: false`** keeps the ring from hiding anything drawn after it. three.js leaves depth writes on unless you turn them off.
- **`transparent: true`** puts the ring in the group three.js draws after all the solid objects, so the floor is already drawn when the ring adds onto it.
- `dashes.mul(0.75).add(0.25)` is 1 on a dash and 0.25 between dashes, so a dim ring shows between the bright ones.

## Step 5 · Put it on the floor

```js
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), material);
mesh.position.set(center.x, 0.01, center.z);
mesh.scale.setScalar(radius / RING_RADIUS);
return mesh;
```

- `PlaneGeometry` stands upright, facing +Z. `rotateX(-Math.PI / 2)` lays it flat, facing up. Calling it on the geometry changes the vertex data, which leaves the mesh's own `rotation` free.
- y = 0.01 lifts the ring just above the floor. At exactly 0 the two would fight over the same depth and flicker in stripes as you orbit.
- The ring sits at `RING_RADIUS` in a square 1 across, so scaling the square by `radius / RING_RADIUS` puts the ring at `radius` in the world.

## Check it

Compare yours with the reference on the right, and go through the list:

- Clicking a part puts a ring on the floor under it. Clicking another part moves it there, and clicking the empty floor removes it.
- The ring is centered under the part and wide enough to surround its footprint, thin parts included.
- It's a soft-edged ring made from a distance field, not a texture.
- Dashes spin around it at a steady speed, with no seam, and the spin uses wrapped time (`fract`).
- It glows: the ring brightens the floor and never darkens it, and the square around it doesn't show.
- It lies just above the floor, with no flicker as you orbit.

When it passes every point, mark it done. Next time, build it from memory.

<div data-mark-done></div>
