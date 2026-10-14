---
id: tactile.grounding.page
elective: tactile
kind: page
concepts: [tactile.grounding]
---

# Shadows and grounding

> **In short:** An object looks like it sits on something only where that something gets darker at the contact, and the HDRI never does that on its own.
>
> **Used for:** Products on a page or a floor, furniture in a room planner, game props on terrain, and any viewer where things look pasted on.

## Why it works

### The four switches

A shadow from a light needs four switches on: the renderer's shadow map, the light's `castShadow`, `castShadow` on each object that blocks the light, and `receiveShadow` on each surface it falls on. Turn any one off and the floor shows nothing.

<div data-scene="switches"></div>

### Fitting the shadow camera

A directional light takes a depth picture of the scene from its own point of view, through a box-shaped **shadow camera**. The picture has a fixed number of texels, so the bigger the box, the coarser each one. Make the box just big enough to hold everything that casts a shadow. Tick the box to see it.

<div data-scene="fit"></div>

### Acne and peter-panning

Comparing a surface with the depth picture of itself, half its points come out "behind" by rounding, and the surface shadows itself in stripes: **shadow acne**. three.js avoids most of it by putting a solid's back faces in the picture (`shadowSide`), so its lit front is never compared with itself; thin sheets and double-sided surfaces still get it. `normalBias` pushes each point a little out along its surface before comparing; `bias` pushes the comparison toward the light. Too much of either and shadows start away from where things touch, so objects seem to float: **peter-panning**.

The scene starts with front faces, as a thin sheet would be, and a coarse map with no blur so the stripes are big enough to see. Zoom in on the roll to find them, then raise `normalBias` until they go.

<div data-scene="acne"></div>

### Softness

`PCFShadowMap`, the default, takes a few samples around each point; `shadow.radius` spreads them, in texels, so a bigger map with the same radius is sharper. `PCFSoftShadowMap` is still exported, but r186 removed the shadow type: set it and three.js warns and uses `PCFShadowMap`. Every one of them softens every edge by the same amount, while a real shadow is sharp where things touch and softer farther away.

<div data-scene="soft"></div>

### What grounds an object

An HDRI casts no shadows. Its light reaches every point as if nothing were in the way, so the floor right under the roll is as bright as open floor, even with a bare lamp in the room. Three tools add the darkness that grounds it:

- A **contact shadow** photographs the scene from below and darkens the ground wherever something is close to it.
- **GTAO** (ground-truth ambient occlusion) looks at the finished picture's depth and darkens creases and corners on screen.
- A **shadow catcher** (`ShadowMaterial`) is a ground that's invisible except for the shadows on it, so a product can sit on the page's own color.

<div data-scene="ground"></div>

Measured beside the leather roll under the bare lamp, against open floor: 103% with the HDRI alone, 54% with the key light's shadow, 66% with the contact shadow, and 54% with GTAO.

### An AO map darkens only environment light

An AO map stores, per texel, how hidden a crease is. three.js multiplies it into the light from the environment only: the HDRI, and any ambient or hemisphere light. The key light's direct light passes untouched. On the denim, the AO map darkens the swatch by 24% under the HDRI alone, 20% with the key added, and 0% with the key alone. GTAO is different: it darkens the finished picture, key light included.

<div data-scene="aoMap"></div>

## The code

### The four switches

```js
renderer.shadowMap.enabled = true; // after the first frame, also set material.needsUpdate = true
key.castShadow = true;
roll.castShadow = true;
ground.receiveShadow = true;
```

### Fit, bias, and softness

```js
Object.assign(key.shadow.camera, { left: -0.35, right: 0.35, top: 0.35, bottom: -0.35 });
key.shadow.camera.updateProjectionMatrix();
key.shadow.normalBias = 0.002; // 2 mm: no acne, no gap
key.shadow.radius = 3;         // texels of blur
```

### Contact shadow, GTAO, and a shadow catcher

```js
const gtao = new GTAOPass(scene, camera, width, height);
gtao.updateGtaoMaterial({ radius: 0.06, thickness: 0.1, scale: 1.5 }); // meters, for an 8 cm roll
composer.addPass(new RenderPass(scene, camera)); composer.addPass(gtao); composer.addPass(new OutputPass());
ground.material = new THREE.ShadowMaterial({ opacity: 0.45 });       // only the shadow shows
```

A contact shadow is a small render of its own: an orthographic camera on the ground looking up, a picture of how close each thing is to the floor, blurred twice and laid on the floor as see-through black.

## What's off?

Each scene starts with something wrong. Fix it with the controls: the counter says how many things are still off, not which.

<div data-scene="offShadow"></div>

<div data-scene="offAo"></div>

## How it goes wrong

- **No shadow at all.** One of the four switches is off. If `shadowMap.enabled` was turned on late, set `material.needsUpdate = true`.
- **Blocky shadows.** The shadow camera covers far more than the objects. Fit it.
- **A shadow cut off at one side.** The shadow camera is too small. Widen it until it holds every caster.
- **Stripes or grain across lit surfaces, usually thin or double-sided ones.** Shadow acne. Raise `normalBias` a millimeter or two.
- **Objects float above their shadows.** Too much `normalBias` or `bias`. Lower it.
- **"PCFSoftShadowMap gives soft shadows."** The name still exists, but r186 treats it as `PCFShadowMap`. Use `shadow.radius`.
- **"The HDRI casts shadows."** It never does. Add a light's shadow, a contact shadow, or GTAO.
- **"An AO map darkens everything in crevices."** Only the environment's light. Leave `aoMapIntensity` at 1; GTAO darkens on screen.

<div data-mark-done></div>
