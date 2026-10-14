---
id: effects.contact-shadows.page
elective: effects
kind: page
concepts: [effects.contact-shadows]
renderer: webgpu
---

# Contact shadows

> **In short:** A thin, sharp shadow right where two things touch, filling in what the key light's shadow map misses.
>
> **Used for:** products resting on a floor in hard light, small parts against a case, feet on the ground, and furniture legs.

## What it adds

### Shadow at the point of touch

A shadow map draws the scene from the light into a grid of depths, then asks of every pixel whether something nearer the light is in the way. Each depth is nudged away from the surface (the `bias`) so surfaces don't shadow themselves in stripes. The nudge is a share of the shadow camera's depth range, from `near` to `far`. three.js's default box for a directional light is 10 × 10 units across and runs 0.5 to 500 deep, so a bias of −0.0005 is a quarter of a unit, about a strap's thickness here. Right where a part touches the floor, the light still gets in, and the part looks like it floats.

**Contact shadows** (screen-space shadows) check the last stretch on screen. From each pixel they step a short way toward the key light through the depth of the picture. If a surface on screen is in the way, that pixel is shadowed. The result darkens only the key light, inside each material's lighting.

Think of standing in the sun and checking for shade by looking a few steps toward the sun. You'll spot the overhang above your head, but not the building down the street.

Start with **key light only**, since the studio's soft light hides most of the difference, and the **close up**. Pick the **three.js default** shadow camera and **shadow map only**: the strap's right edge floats above its shadow. Switch the **shadow map** to **4096**: the outline sharpens, but the gap stays. **Contact shadows on** draws a thin shadow along the contact. Then pick **fitted**, where `near` and `far` hug the watch: the gap closes on its own, and contact shadows add little. **Contact shadows alone** shows what they mark.

<div data-scene="adds"></div>

## What it costs

### A depth pass and a short march

The shadow has to exist before the scene is lit, so the scene's shapes are drawn twice: once for depth, once in color. Then each pixel takes a step for every pixel its short ray crosses on screen, times `quality`. A longer reach and a higher pixel ratio both make that ray more pixels long, on top of the extra pixels. A bigger shadow map costs too: 4096 is four times the depth pixels of 2048, drawn every frame.

**Off** drops both the depth pass and the march: one scene draw, as a viewer without contact shadows has. Try it, each quality, the longer reach, a 4096 shadow map, and pixel ratio 2, pressing **time it** for each. The readout keeps each setting's time.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once, so a frame of many passes reads several times too long; the budget page shows how far.

## When to use it

The watch's WebGi setup doesn't use screen-space contact shadows. What it calls a contact shadow is a blurred shadow on the floor, made once from below; the baked soft ground shadow page covers that kind. Under a soft studio light, contact shadows barely show, as **studio** makes clear.

| Use it | Skip it |
| --- | --- |
| A shadow camera that must cover a big area: a room, a row of products | One product with a fitted shadow camera |
| A hard key light, like sun or a spotlight | Soft, even studio lighting |
| Close-ups of small parts that touch | Phones, unless it's measured on one |

Fit the shadow camera first: it's free, and here it fixed the floating by itself. For the darkness in creases under soft light, ambient occlusion is the effect to reach for.

## The code

### Draw depth first

```ts
const prePass = pass(scene, camera, { samples: 0 }); // TRAA replaces MSAA
prePass.transparent = false; // see-through parts don't block the light
prePass.setMRT(mrt({ output: velocity }));
const depth = prePass.getTextureNode('depth');
```

### March toward the light, then light with it

```ts
const contact = sss(depth, camera, keyLight); // one directional light
contact.maxDistance.value = 0.15; contact.quality.value = 0.5; // reach in world units; steps
contact.useTemporalFiltering = true; // a different start each frame, smoothed by TRAA
scenePass.contextNode = builtinShadowContext(contact.getTextureNode().sample(screenUV).r, keyLight);
```

`builtinShadowContext` multiplies it into that light's shadow only, so the environment's light is untouched. The reach and thickness are picked by eye for a watch about 3 units tall. A plain WebGL viewer has no screen-space shadow pass; the closest is a shadow camera fitted tightly around the product, plus ambient occlusion.

### Fit the shadow camera first

```ts
Object.assign(key.shadow.camera, { near: 5.9, far: 12.8 }); // just around the watch and its shadow
key.shadow.camera.updateProjectionMatrix(); // bias −0.0005 now moves the shadow 0.003 units, not 0.25
```

The bench fits `left`, `right`, `top`, and `bottom` too, every frame, since the light moves on some pages (`fitShadowCamera` in `electives/effects/stage.ts`). The tactile elective's Shadows and grounding page teaches the fit.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Parts still float after a bigger shadow map | The bias is a share of a 500-unit depth range | Fit the shadow camera's `near` and `far` tightly, so the same bias is a shorter distance; add contact shadows where it can't be fitted |
| Grainy, stair-stepped edges | One sample pattern per frame, no smoothing | TRAA (`useTemporalFiltering`), or blur it |
| Shadows from off-screen parts missing | Only what's on screen can block the light | Keep the shadow map for anything big |
| Thin parts cast shadows that are too long | Everything is assumed `thickness` deep | Lower `thickness` |
| Nothing changes under the studio light | It darkens only the key light, which is a small share there | Expected; skip it for soft lighting |
| Slow at pixel ratio 2 or long reach | Rays get more pixels long | Keep the reach short, lower `quality` |

<div data-mark-done></div>
