---
id: 1.materials.shadows.read-the-code.1
loop: 1
tier: light
concepts: [materials.shadows]
mode: read-the-code
context: materials.shadows/fit-directional
lenses: []
misconceptions:
  - materials.shadows/bigger-map
---

# Shadows

> **In short:** A shadow in three.js comes from a depth render seen from the light, the shadow map: each pixel then checks whether something nearer the light blocks it, and how much of the scene the light's shadow camera covers sets how sharp the shadow comes out.
>
> **Used for:** The soft shadow under a product that keeps it from looking like it floats; sunlight through a warehouse's racks; checking at a glance which part sits on top of which; and the moving shadows of anything that animates, which baked lighting can't give.

## A · The basics

### A picture taken from the light

To know what's in shadow, three.js first renders the scene from the light's point of view, keeping only how far away each surface is. That picture is the **shadow map**. Then, drawing the scene normally, each pixel asks: is something in the shadow map closer to the light than I am? If so, it's in shadow.

A DirectionalLight takes its picture with a **shadow camera**, an orthographic camera (the frustum page) whose box covers part of the scene. The shadow map's pixels are spread across that box, so the same 512 × 512 map is sharp over a small box and blocky over a big one. Fitting the box tightly around what casts and receives shadows is the cheapest way to sharpen a shadow.

**Analogy: a security camera.** Mounted where the light is, it sees everything the light hits; whatever it can't see is in shadow. Aim a low-resolution camera at a whole parking lot and each car is a few blocky pixels; aim the same camera at one car and it's sharp.

### Acne and peter-panning

Comparing distances with a limited number of steps can make a surface shadow itself in stripes, called **shadow acne**. three.js avoids most of it by drawing the back faces of single-sided meshes into the shadow map, but a `DoubleSide` surface that casts shadows, like the floor here, or a sheet of fabric, gets it. The fix is a **bias**: a small nudge so a surface doesn't count itself as its own blocker. Too much bias and shadows start away from whatever casts them, so the stool looks like it floats: that's called **peter-panning**, after Peter Pan losing his shadow. A bigger map doesn't cure either one.

Resize the shadow camera's box (the gray lines), switch the map size, and try each bias.

<div data-scene="shadowMap"></div>

## B · Working knowledge

### The four lines, and one more

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;
model.traverse((child) => { if (child.isMesh) child.castShadow = true; });
floor.receiveShadow = true;
```

The renderer settings tour covers these. One more trap: turn `shadowMap.enabled` on before the first render. Materials already drawn keep a shader without shadows until you set `material.needsUpdate = true`.

### Fitting a directional shadow

```js
sun.shadow.camera.left = -3;
sun.shadow.camera.right = 3;
sun.shadow.camera.top = 3;
sun.shadow.camera.bottom = -3;
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.mapSize.set(1024, 1024);
scene.add(new CameraHelper(sun.shadow.camera)); // see the box while you tune it
```

- The default box is −5 to 5, 10 units wide, with a 512 × 512 map, and reaches from 0.5 to 500 units in depth; fit `near` and `far` too. The shadow camera sits at the light and looks at `sun.target`, so move both to move the box.
- **Fit first, then raise `mapSize`.** Doubling `mapSize` costs four times the memory, and four times the pixels to fill in every shadow render; shrinking the box to half its width gives the same sharpness for free.
- **Softer edges:** `sun.shadow.radius` widens the blur of the default `PCFShadowMap`. `PCFSoftShadowMap` was removed in r186: setting it logs a warning and falls back to `PCFShadowMap`.

### Bias

```js
sun.shadow.normalBias = 0.02; // a nudge along each surface's normal, in scene units
sun.shadow.bias = -0.001;     // a nudge in depth, as a fraction of the shadow camera's near-to-far range
```

Start at 0, nudge until the acne goes, and stop there. Refitting `near` and `far` changes what a `bias` value does; `normalBias` is in scene units, which makes it easier to tune.

### A contact shadow under a product

```js
const catcher = new Mesh(new PlaneGeometry(4, 4), new ShadowMaterial({ opacity: 0.3 }));
catcher.receiveShadow = true;
```

`ShadowMaterial` draws only the shadow and is see-through everywhere else, so a product can sit on a page's white background with a soft shadow under it. For a shadow that never changes, a baked one is cheaper (the baked lighting page).

### Custom vertex effects

The shadow render draws meshes with a built-in depth material, not yours. A mesh whose shader moves its vertices, such as waving grass, casts the shadow of its unmoved shape unless you give it a matching `customDepthMaterial` (`customDistanceMaterial` for point lights). The extending materials page, in the shaders domain, covers writing one.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
