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

> **In short:** three.js draws shadows by first rendering the scene from the light, and the area that render covers decides how sharp they are.
>
> **Used for:** Grounding a product on a page, sunlight through warehouse racks, showing what sits on what, and moving shadows.

## A · The basics

### A picture taken from the light

To know what's in shadow, three.js first renders the scene from the light, keeping only how far away each surface is. That picture is the **shadow map**. Then, drawing the scene normally, each pixel asks whether something in the shadow map is closer to the light than it is.

A DirectionalLight takes that picture with a **shadow camera**, an orthographic camera whose box covers part of the scene. The map's pixels are spread across the box, so the same map is sharp over a small box and blocky over a big one.

**Analogy: a security camera.** Mounted where the light is, it sees everything the light hits. Aim a low-resolution camera at a whole parking lot and each car is a few blocky pixels; aim it at one car and it's sharp.

### Acne and peter-panning

Comparing distances with limited precision can make a surface shadow itself in stripes, called **shadow acne**. three.js avoids most of it, but a `DoubleSide` surface that casts shadows, like the floor here, still gets it. The fix is a **bias**, a small nudge so a surface doesn't block itself. Too much, and shadows start away from whatever casts them, so the stool seems to float: that's **peter-panning**. A bigger map cures neither.

Resize the shadow camera's box, switch the map size, and try each bias.

<div data-scene="shadowMap"></div>

## B · Working knowledge

### Turning shadows on

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;
model.traverse((child) => { if (child.isMesh) child.castShadow = true; });
floor.receiveShadow = true;
```

Turn `shadowMap.enabled` on before the first render: materials already drawn keep a shader without shadows until you set `material.needsUpdate = true`.

### Fitting a directional shadow

```js
const shadowCam = sun.shadow.camera;
shadowCam.left = shadowCam.bottom = -3;
shadowCam.right = shadowCam.top = 3;
shadowCam.updateProjectionMatrix();
```

The default box is 10 units wide, with a 512 × 512 map. Fit the box first, then raise `sun.shadow.mapSize`: doubling it costs four times the memory, while halving the box's width gives the same sharpness for free. `new CameraHelper(sun.shadow.camera)` shows the box while you tune it.

### Bias and soft edges

`sun.shadow.normalBias` nudges along each surface's normal, in scene units, and `sun.shadow.bias` nudges in depth. Start both at 0, nudge one until the acne goes, and stop there. For softer edges, raise `sun.shadow.radius`; asking for `PCFSoftShadowMap` only logs a warning and falls back to `PCFShadowMap`.

### A contact shadow under a product

```js
const catcher = new Mesh(new PlaneGeometry(4, 4), new ShadowMaterial({ opacity: 0.3 }));
catcher.receiveShadow = true;
```

`ShadowMaterial` draws only the shadow and is see-through everywhere else, so a product can sit on a white page with a soft shadow under it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
