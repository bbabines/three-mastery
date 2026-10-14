---
id: effects.ambient-occlusion.page
elective: effects
kind: page
concepts: [effects.ambient-occlusion]
renderer: webgpu
---

# Ambient occlusion

> **In short:** Creases, gaps, and corners get darker, because less of the surrounding light can reach into them.
>
> **Used for:** parts that look pasted together, seams and crevices, objects resting on a floor, and rooms where corners look flat.

## What it adds

### Darkness where surroundings close in

The environment lights every surface as if nothing were in the way. So the gap between the strap and the case gets as much light as the open case back, and parts look pasted on rather than tucked in. **Ambient occlusion** (AO) works out, for every pixel, how much of the space around it is blocked by nearby surfaces, and darkens it by that much. Here it's GTAO (ground-truth ambient occlusion), which reads the depth and facing of the pixels around each one.

The jewelry elective's shadows, glow, and smooth edges page shows it on a ring; this page is about what it costs and when it's worth it.

Think of a room on an overcast day. No lamp casts a shadow, yet the corners and the space under the sofa are dimmer, because the sky's light can only get in from a few directions.

Pick **the darkening alone**, then move the **key light**: its shadow moves, the darkening doesn't. It's worked out from shapes alone; no light goes into it. Compare **environment only** with **whole picture**, which also darkens the key light's bright side where it should be lit. Then try **strong**.

<div data-scene="adds"></div>

## What it costs

### Samples, size, and a second draw

Each pixel samples the depth around it, 16 times by default, every frame, with a different pattern each frame that smoothing over frames (TRAA) blends away. Working it out at half size saves much of the cost, but on parts this small the grain shows through. At pixel ratio 2 there are four times as many pixels.

The two routes cost differently. **Whole picture** reads the normals and depth the scene draw already wrote, so it adds only the darkening pass. **Environment only** needs the darkening before the scene is lit, so the scene's shapes are drawn twice: once for normals and depth, once in color.

Try each route at 8, 16, and 32 samples, at half and full size, then at pixel ratio 2, pressing **time it** for each. Compare **off** with each setting to see what the darkening adds. The readout keeps each setting's time.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once, so a frame of many passes reads several times too long; the budget page shows how far.

## When to use it

The watch's WebGi setup turns it on, gently: intensity 0.25, darkening environment light only. Its job there is small: the gap under the case, the lugs against the strap, the crown against the case.

| Use it | Skip it |
| --- | --- |
| Parts that touch or nest into each other | A single smooth shape on a plain floor |
| Lighting that's mostly environment | Scenes already lit by baked lighting with occlusion in it |
| Desktop viewers with time to spare | Phones, unless it's measured on one |

When the product never changes shape, an ambient occlusion map baked in Blender (`aoMap`) gives the same darkening for free and is sharper.

## The code

### Draw normals and depth first

```ts
const prePass = pass(scene, camera, { samples: 0 }); // TRAA replaces MSAA
prePass.transparent = false; // see-through parts don't block light
prePass.setMRT(mrt({ output: packNormalToRGB(normalView), velocity }));
const normal = sample((uv) => unpackRGBToNormal(prePass.getTextureNode().sample(uv)));
```

### Darken the environment light only

```ts
const aoPass = ao(prePass.getTextureNode('depth'), normal, camera);
aoPass.radius.value = 0.5; aoPass.scale.value = 1.5; // reach in world units; depth of the darkening
aoPass.useTemporalFiltering = true; // a new pattern each frame, for TRAA to blend
scenePass.contextNode = builtinAOContext(aoPass.getTextureNode().sample(screenUV).r);
```

`builtinAOContext` feeds the darkening into each material's lighting, where it scales only light from the environment, both its glow and its reflections. The key light and its shadow pass through untouched. The radius and strength are picked by eye: WebGi's 0.25 belongs to a different method. In a plain WebGL viewer, `GTAOPass` darkens the finished picture instead, like **whole picture**, as the jewelry elective shows.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Dark halos around every part | Radius bigger than the gaps | Keep the radius near the size of the crevices |
| Dirty, smudged look | Strength pushed up to look "more real" | A little: real creases are only slightly darker |
| The lit side of a part goes gray | The darkening multiplies the whole picture, key light too | Apply it to environment light only |
| Darkening that slides with the light | Expecting it to be the key light's shadow | Use the shadow map for that; AO doesn't know where lights are |
| Grain that crawls | Few samples, half size, or no smoothing over frames | TRAA, more samples, or full size |
| No darkening on the dial under the glass | The glass is in the pre-pass, hiding the dial's shape | `prePass.transparent = false` |

<div data-mark-done></div>
