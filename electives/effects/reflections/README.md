---
id: effects.reflections.page
elective: effects
kind: page
concepts: [effects.reflections]
renderer: webgpu
---

# Screen-space reflections

> **In short:** Shiny surfaces pick up reflections of the other things on screen, like a polished floor showing the watch that stands on it.
>
> **Used for:** polished floors under a product, metal parts reflecting their neighbors, wet streets and glossy tiles, and car paint.

## What it adds

### Reflections of what's on screen

Polished metal gets its reflections from the environment map: the studio photo wrapped around the scene. That photo has no watch in it, so a mirror floor shows the studio, never the watch standing on it, and the case never reflects its own strap.

**Screen-space reflections** (SSR) fill that in from the finished picture. For each shiny pixel, they step along the reflected direction through the depth of the picture until they meet something, and copy that pixel's color. Rough surfaces read a blurred copy. By default only metal reflects; other surfaces are skipped, which saves time.

Think of a reflection painted from a photo of the room. Whatever is in the photo can show up in it; anything outside the frame, or hidden behind something, can't.

It starts on the **mirror** floor with the studio **dim**. Switch **reflections on** and **off**, then look at **just the reflections**. Turn the studio **on**: the floor's bright reflection of the studio nearly hides the watch's, because three.js adds the reflection on top. Then make it **dark**: the steel and the floor go black except where they reflect something on screen, so the environment map is still doing most of the reflecting. Last, pick **top cut off**: what's above the frame vanishes from the floor too.

<div data-scene="adds"></div>

## What it costs

### Steps along every ray

Each reflective pixel takes a step for every pixel its ray crosses on screen, times `quality`. So the cost grows with the share of the picture that's metal, with the reach (`maxDistance`), and twice with pixel ratio: four times the pixels, each ray twice as many pixels long. Tracing at half size cuts most of it.

The trace is one pass. Whenever a roughness input is given, as here, six more run every frame: a copy and five ever smaller blurred versions of the reflections, which rough surfaces read. They run even when nothing on screen is rough, which is why the counts line jumps from 4 passes to 11.

Try each quality on the **polished** floor, then **matte**, which reflects nothing and is skipped. Then a **reach** of 1, which is too short to show the whole watch in the floor, **half size**, and pixel ratio 2. Press **time it** for each, and compare **off** with each setting. The readout keeps each setting's time.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once. For **high** at pixel ratio 2 on an M4 Pro Mac, that sum read 121 to 152 ms; **time it** measured 14 to 18.

## When to use it

The watch's WebGi setup turns it on. There, the case and dial reflect dark parts of the watch and come out darker than with the studio alone. A three.js scene added on top can only brighten, so it doesn't match that exactly.

| Use it | Skip it |
| --- | --- |
| A polished floor under the product, on a fast desktop | A matte floor and a matte product |
| Shiny parts close to other parts | Phones, unless it's measured on one |
| Scenes where reflections of nearby things sell the material | Views where the reflected thing is often off screen |

A flat floor can use a mirror render instead (`Reflector` on WebGLRenderer, `reflector()` in TSL). It draws the whole scene a second time, from below the floor, every frame, so it shows the whole watch, on screen or not, and has no gaps. That second scene draw is its cost: cheap for one watch, more than the rays for a big scene. Drawing it smaller (`resolutionScale`, or `textureWidth` on `Reflector`) saves time and softens it.

## The code

### Write what the rays need

```ts
const scenePass = pass(scene, camera, { samples: 0 });
scenePass.setMRT(mrt({ output, normal: packNormalToRGB(normalView), metalrough: vec2(metalness, roughness), velocity }));
const normal = sample((uv) => unpackRGBToNormal(scenePass.getTextureNode('normal').sample(uv)));
const metalRough = scenePass.getTextureNode('metalrough');
```

### Trace, then add

```ts
const reflections = ssr(color, depth, normal, { metalnessNode: metalRough.r, roughnessNode: metalRough.g, camera });
reflections.maxDistance.value = 4; // reach in world units: the watch is about 3 tall
reflections.quality.value = 0.5; reflections.resolutionScale = 1; // steps per pixel crossed; trace size
renderPipeline.outputNode = traa(vec4(color.rgb.add(reflections.rgb), color.a), depth, velocity, camera);
```

The reflection is added to the picture, as three.js's own example does. `reflectNonMetals: true` makes polished wood or plastic reflect too. In a plain WebGL viewer, `SSRPass` does the same job.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Reflections vanish as the view turns | The reflected thing left the screen | Keep the environment map; use a mirror render for floors |
| A reflection stops at a hard line | It reached the screen's edge; the mirror kind doesn't fade there | Accept it, or frame the product away from the edges |
| Black metal with the studio dimmed | Expecting SSR to replace the environment map | Keep a good environment map; SSR only adds to it |
| The reflection barely shows on a bright, shiny floor | It's added on top of the floor's bright reflection of the studio | A darker floor or dimmer surroundings, or a mirror render |
| A polished plastic floor reflects nothing | Non-metals are skipped by default | `reflectNonMetals: true` |
| Gaps or smears behind thin parts | The depth picture has no back sides | Raise `thickness` a little, or accept it |
| Slow at pixel ratio 2 | Four times the pixels, each ray twice as long | `resolutionScale = 0.5`, or a lower `quality` |

<div data-mark-done></div>
