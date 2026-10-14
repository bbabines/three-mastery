---
id: tactile.scale.page
elective: tactile
kind: page
concepts: [tactile.scale]
---

# Scale and distance

> **In short:** A material is believable only at its real size, with a scan detailed enough for how close you'll see it, and filtered so it holds still far away.
>
> **Used for:** Fabric and leather swatches in a configurator, gym equipment seen across a room, floors and walls in architectural scenes, and game levels seen up close and far off.

## Why it works

### Real size

Every scan is a photo of a patch of a certain size. Set `texture.repeat` so one tile covers that size on the model, and the grain looks right next to everything else. Get it wrong and the material stays perfectly sharp, but reads as a different material: leather with pebbles twice too big looks like elephant hide.

A source's stated size can be wrong too. The leather's page lists both 60 cm and 30 cm; counting its pebbles against a ruler settles it at 30. Change the tile size and compare the grain with the ruler.

<div data-scene="realSize"></div>

### Texel density: the scan's and the screen's

**Texel density** is how many texture pixels cover each centimeter of the surface. A scan has one: 2,048 pixels across a 30 cm leather tile is 68 px/cm. The screen has one too, which changes as you zoom: how many screen pixels each centimeter of the sample covers. When the screen's is higher, the scan blurs; when the scan's is higher, the GPU reads a smaller copy of it (a **mipmap**), so the extra pixels cost memory and show nothing.

So pick a scan made for your viewing distance. The painted steel scan spreads its 4,096 pixels over 2.5 m, so a 24 cm sample of it is soft up close at 16 px/cm; the same file is more than enough for a whole floor seen from standing height. Zoom in and out, switch scans, and load each at a lower resolution.

<div data-scene="texel"></div>

### Far away: repeats and shimmer

Seen from a distance, a small tile shows its **repeats**: the same vein or mark in a grid. A bigger scan helps, and so does a soft, large pattern that lightens and darkens each copy differently.

<div data-scene="repeats"></div>

Far away, many texels land on each screen pixel. Without mipmaps the GPU picks one of them, a different one as the camera moves, so the texture crawls, and the normal map's bumps glitter wherever light glints off the floor. Mipmaps fix both, but blur both ways where the floor is only squashed one way, so it smears toward the back; **anisotropic filtering** takes more samples along the squashed direction. Fading the normal map with distance is a small extra on top. Tick "move the camera slowly" and try each setting; the painted steel shows the smear best.

<div data-scene="shimmer"></div>

## The code

### Real size

```js
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1 / 0.3, 1 / 0.3); // UVs in meters, one tile every 30 cm
```

### Steady far away

```js
texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // usually 16
texture.generateMipmaps = true;                                 // the default; keep it
texture.minFilter = THREE.LinearMipmapLinearFilter;            // the default too
```

### Fade the normal map with distance

```js
// in material.onBeforeCompile, inside the normal map code
mapN.xy *= normalScale * (1.0 - smoothstep(2.0, 8.0, length(vViewPosition)));
```

## What's off?

Each scene starts with something wrong. The counter says how many things are still off, not which.

<div data-scene="offGiant"></div>

<div data-scene="offFloor"></div>

## How it goes wrong

- **"Real-world size doesn't matter if it looks sharp."** A tile at the wrong size is sharp and wrong: the grain says a different material. Set `repeat` from the scan's real size.
- **"Higher resolution always looks more real."** Past the screen's density it adds memory, not detail, and it can't fix a wrong size or a scan made for another distance.
- **"Any scan of the material will do."** A scan of a big surface spreads its pixels thin: on a small sample up close it's soft, and its features (a floor's tile joints, a plate's panel seams) don't belong. Pick a scan whose size suits your view.
- **A grid of identical marks across a big surface.** The tile repeats. Use a bigger scan or add large-scale variation.
- **Crawling, moiré, or glitter far away.** Mipmaps are off. Keep `generateMipmaps` on; for a glossy floor, also fade `normalScale` with distance.
- **A floor that smears toward the horizon.** Set `anisotropy` to the GPU's maximum.

<div data-mark-done></div>
