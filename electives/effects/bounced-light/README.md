---
id: effects.bounced-light.page
elective: effects
kind: page
concepts: [effects.bounced-light]
renderer: webgpu
timing: gpu
---

# Bounced light

> **In short:** Nearby surfaces light each other, so a bright colored board tints the metal facing it and dark gaps fill with reflected light.
>
> **Used for:** products beside colored props, rooms with painted walls, interiors and furniture, and crevices that look too dark.

## What it adds

### Light that arrives off other surfaces

In a real studio, light hits the floor and the walls and comes back. A white card held beside a watch brightens the side facing it; an orange card warms it. A normal render skips all of that. Each surface is lit only by the lights and the environment, never by its neighbors.

**Bounced light** fills that in. For every pixel it looks at the pixels around it on screen and asks which of them face it and how bright they are. It's sometimes called SSGI: screen-space global illumination. The same pass also works out **ambient occlusion**, the darkening where surfaces block each other. The two are different things: occlusion only takes light away, and bounce adds light that occlusion can't.

Think of a dinner table with a red tablecloth. Everyone's face picks up a little red from below. Nobody lit their faces red; the cloth did.

Switch between the views. Look at the steel case and the underside of the strap where it faces the card, then change the card's color. **Darkening only** keeps the occlusion and drops the bounce. **Just the bounce** shows the light the effect adds, by itself.

<div data-scene="adds"></div>

## What it costs

### Samples, pixels, and frames

Each pixel takes `sliceCount × stepCount × 2` samples, every frame. Medium is 32 samples a pixel; high is 96. At pixel ratio 2 there are four times as many pixels, so roughly four times the cost.

One frame of it is grainy, because 32 samples can't cover every direction. So it's made to change its sample pattern each frame and is smoothed over frames with **TRAA** (temporal reprojection anti-aliasing), which blends each new frame into the last ones. While the watch turns, that blending can leave faint trails.

Try each quality at pixel ratio 1, then at 2. Then switch to **raw, one frame** to see the grain the smoothing hides, and to **turning** to look for trails. The readout keeps each setting's measured time.

<div data-scene="costs"></div>

The time is the GPU's own clock for the whole frame, on the machine you're using. Compare **off** with each quality to see what bounced light adds. Measure on a phone too; it has far less to spare than a desktop graphics card.

## When to use it

The watch's own WebGi setup is a good guide. Bounced light is saved in it, but switched off, and so are contact shadows. Its look comes from reflections, ambient occlusion (strength 0.25), TRAA, and 32 averaged still frames. A single product on a light, even backdrop has little nearby to bounce light off it.

| Use it | Skip it |
| --- | --- |
| Bright or colored surfaces close to the product | One product on a plain backdrop |
| Rooms and interiors, where walls light everything | Phones, unless it's tested on one |
| Crevices that look dead even with ambient occlusion | A scene that has to stay sharp while it moves |

If you need the darkening but not the bounce, ambient occlusion alone is cheaper and gives you most of it.

## The code

### Write the buffers it reads

```ts
const scenePass = pass(scene, camera);
scenePass.setMRT(mrt({ output, diffuseColor, normal: packNormalToRGB(normalView), velocity }));
const color = scenePass.getTextureNode('output'); // likewise 'diffuseColor', 'depth', 'velocity'
const normal = sample((uv) => unpackRGBToNormal(scenePass.getTextureNode('normal').sample(uv)));
```

One draw of the scene fills four pictures at once: the color, each surface's own color, its facing direction, and how far it moved since the last frame. Depth comes with every pass.

### Add the bounce, then smooth it

```ts
const gi = ssgi(color, depth, normal, camera);
gi.sliceCount.value = 2; gi.stepCount.value = 8; // medium
const lit = vec4(color.rgb.mul(gi.getAONode()).add(surface.rgb.mul(gi.getGINode().rgb)), color.a);
renderPipeline.outputNode = traa(lit, depth, motion, camera);
```

The bounce is multiplied by the surface's own color, so an orange card lights a white floor orange but barely shows on black leather. `radius` sets how far it reaches in world units; the watch is about 3 units across, so this page uses 2.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| The card's glow vanishes when you turn the view | Only on-screen pixels bounce light | Accept it, or bake the light, or add a fill light |
| Light leaks onto the back of thin parts | Everything is assumed `thickness` deep | Lower `thickness` for thin products |
| Grainy shimmer on every surface | No smoothing over frames | Use TRAA, or a denoise pass with more samples |
| Faint trails while turning | TRAA blending old frames into new ones | Fewer moving parts, or accept it for still shots |
| The whole picture brightens | Bounce added on top of light the environment already gave | Lower `giIntensity` until only the nearby glow shows |

<div data-mark-done></div>
