---
id: effects.anisotropy.page
elective: effects
kind: page
concepts: [effects.anisotropy]
renderer: webgpu
---

# Brushed metal

> **In short:** Highlights stretched into streaks in one direction across a surface, the way fine grooves from brushing or spinning spread light on metal.
>
> **Used for:** sunburst watch dials, brushed steel appliances, spun metal caps and knobs, and satin or hair.

## What it adds

### A highlight that stretches

**Anisotropy** stretches a highlight into a streak across fine grooves, the way brushing leaves metal: `anisotropy` (0 to 1) sets how far, and a direction across the surface sets which way. The product elective's Tactile materials and texture scale page introduces it on the watch's cover; this page covers what it costs and when it's worth it.

Think of a hairbrush dragged through paint: every bristle leaves a line, and light catches the lines from one side and not the other.

The watch file saves brushing for two parts, in WebGi's own extension, which GLTFLoader keeps as data but doesn't apply: the dial at strength 1.5 (three.js stops at 1) with a map of angles around its center and each sub-dial, which reads as a **sunburst** finish, and the cover at 0.84. Switch between **the file's, restored** and **off**, and watch the dial while the light moves: the restored dial shows light and dark wedges that turn with the light.

<div data-scene="adds"></div>

### The direction comes from the UVs

On the test disc below, a small lamp moves in front of brushed steel. Compare **anisotropy 0.8** with **plain polished**: a streak instead of a round spot, running across the grooves. **Turned 90°** turns it with `anisotropyRotation`. A direction map gives every pixel its own: **spun**, grooves in circles like a record's, streaks out from the center; **sunburst**, grooves out from the center, streaks around it.

**Brushed color map only** paints lines into the color, and the highlight stays a round spot: a brushed-looking color map doesn't make brushed metal. **No UVs** turns the disc white: three.js takes the direction (the **tangent**) from the mesh's `tangent` attribute, or else from how its UVs run, and here there's neither.

<div data-scene="direction"></div>

## What it costs

### A little math, only where it's used

Anisotropy adds a few steps to the lighting of every pixel of the brushed part, and a direction map adds one texture read. A `MeshPhysicalMaterial` with `anisotropy` at 0 leaves that code out, and other materials never pay for it.

Here the disc fills the picture, so every pixel pays. Compare the four materials at pixel ratio 1, then 2, pressing **time it** for each.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer.

On an M4 Pro Mac, two runs each, every material cost about 0.1 ms a frame at pixel ratio 1 and 0.3 to 0.5 at 2 on WebGPU, and 0.2 to 0.3 and 0.8 to 1.3 on WebGL 2, with the order changing from run to run: the difference is smaller than the noise. It's worth measuring on a phone if a brushed part fills most of the screen.

## When to use it

The live WebGi page has its anisotropy plugin switched off, so the brushing saved in the watch isn't part of the reference look, and the captured reference shows a plain dial.

| Use it | Skip it |
| --- | --- |
| Brushed or spun metal seen up close | Polished metal: it needs round, sharp highlights |
| Sunburst dials, knobs, caps | Brushing too fine to see at the viewing distance |
| Meshes with tangents or clean UVs | Meshes without UVs, or with UVs that run in all directions |

Cheaper: none really; it's already cheap. Without it, a rough metal (roughness 0.4 or so) hides the round highlight, but it never streaks.

## The code

### Brush a part

```ts
const metal = new THREE.MeshPhysicalMaterial({ color: 0xd0d0d0, metalness: 1, roughness: 0.3 });
metal.anisotropy = 0.8;                 // 0 to 1: how far highlights stretch
metal.anisotropyRotation = Math.PI / 2; // turns the direction away from the UVs' u
```

### Give each pixel its own direction

```ts
directions.colorSpace = THREE.NoColorSpace; // a data map: never sRGB
metal.anisotropyMap = directions;           // red, green: direction; blue: strength
```

A glTF file with `KHR_materials_anisotropy` sets all three through GLTFLoader. The watch uses WebGi's own extension instead, so `electives/effects/anisotropy/brushed.ts` puts it back by hand and turns the dial's angle map into a direction map. The same properties work on WebGLRenderer.

### Make sure there's a direction

```ts
geometry.hasAttribute('tangent'); // used when present
geometry.hasAttribute('uv');      // otherwise needed to work the tangent out
geometry.computeTangents();       // or make tangents from the UVs (needs an index, normals, and uv)
```

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Lines, but a round highlight | Brushing painted into the color map | Use `anisotropy`; keep the color map for color |
| The part turns flat white | No UVs and no tangents | Add UVs; `computeTangents()` also needs them |
| Streaks run the wrong way | The direction follows the UVs, not the grooves | `anisotropyRotation = Math.PI / 2`, or fix the UV layout |
| Directions look scrambled | The direction map was loaded as sRGB | `colorSpace = THREE.NoColorSpace` |
| A thin line from the center of a spun part | Directions on each side of the map's seam blur into each other | Put the seam where something covers it, like under the 12 |
| No streak at all from a big, even light | A wide, even reflection has nothing to stretch | Light it with small, bright sources or a contrasty HDRI |
| Nothing changes | The material is `MeshStandardMaterial` | Use `MeshPhysicalMaterial` |

<div data-mark-done></div>
