---
id: effects.bounced-light.page
elective: effects
kind: page
concepts: [effects.bounced-light]
renderer: webgpu
---

# Bounced light

> **In short:** Nearby surfaces light each other, so a bright colored board tints the floor and leather facing it, and dark gaps fill with reflected light.
>
> **Used for:** products beside colored props, rooms with painted walls, interiors and furniture, and crevices that look too dark.

## What it adds

### Light that arrives off other surfaces

In a real studio, light hits the floor and the walls and comes back. A white card held beside a watch brightens the side facing it; an orange card warms it. A normal render skips all of that. Each surface is lit only by the lights and the environment, never by its neighbors.

**Bounced light** fills that in. For every pixel it looks at the pixels around it on screen and asks which of them face it and how bright they are. It's sometimes called SSGI: screen-space global illumination. The same pass also works out **ambient occlusion**, the darkening where surfaces block each other. The two are different things: occlusion only takes light away, and bounce adds light that occlusion can't.

Think of a dinner table with a red tablecloth. Everyone's face picks up a little red from below. Nobody lit their faces red; the cloth did.

Start in the **dim room** and switch between **bounced light** and **off**. Look at the floor in front of the card, the card's lower edge, which the floor lights back, and the watch's shadow. Change the card's color. **Darkening only** keeps the occlusion and drops the bounce; **just the bounce** shows the added light by itself.

Then switch to the **bright studio**. The bounce is still there, but the studio already lights everything, so most of it disappears. The polished steel barely changes in either room. This bounce adds to a surface's own color, and polished metal has almost none: what metal shows is reflection, which the reflections page covers.

<div data-scene="adds"></div>

## What it costs

### Samples, pixels, and frames

Each pixel takes `sliceCount × stepCount × 2` samples, every frame. Medium is 32 samples a pixel; high is 96. At pixel ratio 2 there are four times as many pixels, so roughly four times the cost.

One frame of it is grainy, because 32 samples can't cover every direction. So it's made to change its sample pattern each frame and is smoothed over frames with **TRAA** (temporal reprojection anti-aliasing), which blends each new frame into the last ones. While the watch turns, that blending can leave faint trails.

Try each quality at pixel ratio 1, then at 2, pressing **time it** for each. Compare **off** with each quality to see what bounced light adds. Then switch to **raw, one frame** to see the grain the smoothing hides, and to **turning** to look for trails. The readout keeps each setting's time.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once, so a frame of many passes reads several times too long; the budget page shows how far. Measure on a phone too; it has far less to spare than a desktop graphics card.

## When to use it

The watch's own WebGi setup is a good guide. Bounced light is saved in it, but switched off. Its look comes from reflections, ambient occlusion (strength 0.25), TRAA, 32 averaged still frames, and a blurred contact shadow on its ground. A single product on a light, even backdrop has little nearby to bounce light off it.

| Use it | Skip it |
| --- | --- |
| Bright or colored surfaces close to the product | One product on a plain, bright backdrop |
| Dim or contrasty rooms, where neighbors are a real share of the light | Polished metal, which needs reflections instead |
| Crevices that look dead even with ambient occlusion | Phones, unless it's measured on one |

If you need the darkening but not the bounce, ambient occlusion alone is cheaper and gives you most of it.

A plain WebGL viewer has no screen-space bounce pass in r186. The closest routes: when nothing moves, bake the bounce into a light map in Blender (`material.lightMap`); for one colored prop, a dim light of its color standing where it is (a `RectAreaLight` the card's size); or capture the room once with a `CubeCamera` and turn it into a `LightProbe` (`LightProbeGenerator.fromCubeRenderTarget`), which tints the product by the colors around it but can't tell a near card from a far wall.

## The code

### Write the buffers it reads

```ts
const scenePass = pass(scene, camera, { samples: 0 }); // TRAA replaces MSAA
scenePass.setMRT(mrt({ output, diffuseColor, normal: packNormalToRGB(normalView), velocity }));
const color = scenePass.getTextureNode('output'); // likewise 'diffuseColor', 'depth', 'velocity'
const normal = sample((uv) => unpackRGBToNormal(scenePass.getTextureNode('normal').sample(uv)));
```

One draw of the scene fills four pictures at once: the color, each surface's own color, its facing direction, and how far it moved since the last frame. Depth comes with every pass.

### Add the bounce, then smooth it

```ts
const gi = ssgi(color, depth, normal, camera);
gi.sliceCount.value = 2; gi.stepCount.value = 8; // medium
gi.useScreenSpaceSampling.value = false; gi.radius.value = 3; // reach 3 world units
const lit = vec4(color.rgb.mul(gi.getAONode()).add(surface.rgb.mul(gi.getGINode().rgb)), color.a);
renderPipeline.outputNode = traa(lit, depth, motion, camera);
```

The bounce is multiplied by the surface's own color, so an orange card lights a gray floor orange but barely shows on black leather or polished steel. By default `radius` is a share of the screen's width, so the reach changes with the window; turning off screen-space sampling makes it world units. The watch is about 3 units across. The strength, `giIntensity`, is picked by eye.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| The card's glow vanishes when you turn the view | Only on-screen pixels bounce light | Accept it, or bake the light, or add a fill light |
| Light leaks onto the back of thin parts | Everything is assumed `thickness` deep | Lower `thickness` for thin products |
| Grainy shimmer on every surface | No smoothing over frames | Use TRAA, or a denoise pass with more samples |
| Faint trails while turning | TRAA blending old frames into new ones | Fewer moving parts, or accept it for still shots |
| The whole picture brightens | Bounce added on top of light the environment already gave | Lower `giIntensity` until only the nearby glow shows |
| A gray square around a printed decal, like a dial's numerals | The extra buffers don't blend, so the decal's clear corners write normals too | Make decals cutouts: `alphaTest = 0.5`, `transparent = false` |
| Nothing changes on the steel | Bounce only adds to a surface's own color | Use reflections for metal |

<div data-mark-done></div>
