---
id: tactile.before-you-light.page
elective: tactile
kind: page
concepts: [tactile.before-you-light]
---

# Before you light

> **In short:** Three settings decide whether any lighting can work: a tone mapping (so bright light has somewhere to go), the right color space on each map, and no hidden fill light lifting every shadow.
>
> **Used for:** Product viewers, furniture and fashion configurators, game props, and any scene where a material "looks off" before you've touched a light.

## Why it works

### Tone mapping: where bright light goes

An HDRI holds light far brighter than white: the softbox in this page's studio is about 500 times brighter than white paper. A screen can't show more than white, so something has to decide how that range squeezes down. That's **tone mapping**. three.js turns it off by default, and then everything past white clips to a flat, featureless patch.

**Exposure** is the brightness knob that runs before tone mapping. With tone mapping off, three.js doesn't even build the exposure code into the shader, so the slider does nothing at all.

Each tone mapping squeezes differently. Pick **Neutral** for products: Khronos made it to keep a product's colors close to its source. Watch the velvet's red as you switch: measured on the bench, Neutral keeps its saturation at 0.65, ACES lightens it and drains it to 0.56, and AgX fades it toward white, to 0.37.

<div data-scene="tone"></div>

### Color spaces: which maps are color

A JPG stores color as **sRGB**, with more of its 256 steps spent on the darks, the way screens expect. Lighting needs **linear** numbers, where twice the number is twice the light. Marking a texture `SRGBColorSpace` makes three.js convert as it reads.

Only the color map is color. The normal map stores directions, and the packed map stores ambient occlusion, roughness, and metalness: plain numbers, left at `NoColorSpace`, the default. Each mistake has its own look. Move the light and the camera while you try them.

<div data-scene="colorSpaces"></div>

### The hidden fill light

A **fill light** lights everything a little, from everywhere. This repo's harness adds a `HemisphereLight` to every scene; many tutorials add an `AmbientLight`. It doesn't erase the relief: the bumps still shade exactly as much as before. It adds the same light on top of everything, so the dark side and the shadows lift toward gray, and the relief becomes a smaller part of what you see. On the bench, the harness's fill brightens the swatch by about a fifth and weakens the relief's share by about 15%. Look at the shadow under the roll as well as the grain, and move the key light (presets, sliders, or tick the box and drag on the scene) to see the fill matter most on the side the key doesn't reach.

<div data-scene="fill"></div>

The HDRI already lights the shadow side, the way a real room does. A separate fill is rarely needed, and never one that comes from every direction.

## The code

### Set the renderer up first

```js
renderer.toneMapping = THREE.NeutralToneMapping; // colors closest to the source
renderer.toneMappingExposure = 1;                // only works once tone mapping is on
```

### Load a material's maps

```js
const map = await loader.loadAsync('leather/color.jpg');
map.colorSpace = THREE.SRGBColorSpace;                      // color: sRGB becomes linear light
const normalMap = await loader.loadAsync('leather/normal.jpg'); // directions: left at NoColorSpace
const arm = await loader.loadAsync('leather/arm.jpg');           // AO, roughness, metalness: NoColorSpace
```

GLTFLoader marks a model's color maps sRGB itself. A texture you load by hand starts at `NoColorSpace`.

### Light with the HDRI, not a fill

```js
scene.environment = pmrem.fromEquirectangular(hdr).texture;
// no AmbientLight or HemisphereLight
```

### Change one after it's in use

```js
map.colorSpace = THREE.SRGBColorSpace;
map.needsUpdate = true; // a color space applies when the texture is uploaded
```

## What's off?

Each scene starts with something wrong. Fix it with the controls: the counter says how many things are still off, not which. Try other materials too; every one shows the problem.

<div data-scene="offWashed"></div>

<div data-scene="offGlossy"></div>

## How it goes wrong

- **"I raised the exposure and nothing changed."** Tone mapping is off, so the exposure code isn't in the shader. Set `renderer.toneMapping` first.
- **Blown-out, flat highlights.** Tone mapping is off, and the HDRI's bright spots clip at white. Turn on Neutral.
- **A brand color looks washed out next to the swatch it came from.** ACES and AgX drain strong colors. Use `NeutralToneMapping` for products.
- **Pale, washed-out material.** The color map is at `NoColorSpace`. Set `map.colorSpace = THREE.SRGBColorSpace`.
- **"Every texture should be marked sRGB."** Then the normal map tilts the whole surface, and the packed map makes it too glossy and too dark in the creases. Only color maps are sRGB; in Blender, set the others' image node to Non-Color.
- **Gray, lifted shadows and slightly flatter relief.** A `HemisphereLight` or `AmbientLight` adds the same light everywhere. Remove it; let the HDRI light the shadow side. (If the relief is very flat, check the key light's angle first: that's the next units.)
- **Changed a color space and nothing happened.** Set `texture.needsUpdate = true`.

<div data-mark-done></div>
