---
id: product.delivery-validation.page
elective: product
kind: page
concepts: [product.delivery-validation]
---

# Browser delivery and validation

> **In short:** A product look is ready to deliver when its detail and interaction survive the actual target devices and configuration changes.
>
> **Used for:** Mobile storefronts, finish configurators, slow-network loading, and image-quality budgets.

## Evidence

The fetched watch GLB is 2,019,400 bytes, its EXR 1,349,206 bytes, and external leather normal JPEG 669,204 bytes. These are measured downloads in `assets/reference/classic-watch/manifest.json`; they are not GPU memory totals. The GLB uses Draco compression, six embedded images, and WebGi extensions that ordinary GLTFLoader does not implement.

The source enables several finishing passes. This unit uses the simpler study stage so resolution and texture filtering can be compared without silently measuring a different postprocessing stack. The final delivered stack must be measured again.

## Why it works

**Analogy: packed furniture versus furnished floor space.** A compressed download is the packed parcel. Once decoded, geometry and textures occupy different storage; the renderer also needs environment filtering, framebuffers, shadows, and any postprocessing targets.

DPR scales each buffer dimension. DPR 2 shades four times as many pixels as DPR 1 at the same CSS size. Texture anisotropy improves filtering at oblique angles within device support; it cannot recover detail missing from the texture or screen. KTX2/Basis textures can reduce transfer and GPU storage through supported transcode formats, but their normal-map quality must be checked against the original. Keep normal and roughness data out of sRGB conversion.

Browser frame intervals include scheduling, JavaScript, rendering, refresh-rate limits, and other work. They can expose jank; they are not isolated GPU durations. `renderer.info` supplies draws, triangles, and resource counts, not actual GPU bytes. A phone test requires a phone.

### Exercise 1 · Find the lowest acceptable quality

Compare the **quality** presets while stationary and during continuous orbit. Inspect leather at closest zoom, the rear strap at an oblique angle, case highlights, and dial text. Clear the interval sample after changing the view. Save settings and a comparison PNG for the lowest acceptable preset.

<div data-scene="budget"></div>

**Accept:** explain one visible improvement and its cost. Record buffer dimensions, draw/triangle counts, and interval sample size, median, and p95. The map estimate assumes RGBA8 plus a full mip chain when enabled; it excludes EXR, PMREM, render targets, driver overhead, and texture-format differences. Record your device/browser. Do not label these intervals “GPU time” or claim this desktop test passed on a phone.

### Exercise 2 · Verify repeatable variant changes

Inspect both variants, then run **24 variant switches**. The sweep warms both looks before comparing renderer resource/program counts. Repeat it; then switch manually while orbiting to inspect responsiveness. It changes existing material colors and keeps geometry and maps allocated.

<div data-scene="stability"></div>

**Accept:** counts remain stable after warming, both variants retain leather grain and metal identity, and manual switching does not blank the product. Stable counts alone do not prove absence of every leak or hitch; investigate growth, repeat page navigation, and profile interaction separately.

## The code

The exact measurements and bounded variant sweep run in `scenes.ts`.

```ts
renderer.setPixelRatio(1.5);
texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
texture.needsUpdate = true;
const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
const { calls, triangles } = renderer.info.render;
const { geometries, textures } = renderer.info.memory;

// Reuse loaded resources when a variant only changes finish color.
strap.color.setHex(0x703d22);
metal.color.setHex(0xc9a965);
```

This lab reads the previous `renderer.render` call because the harness runs scene callbacks before drawing. With automatic reset enabled, each separately invoked render starts a new count: this is not a complete multi-render composer frame or a GPU-cost measurement. In r186, reset occurs before that call's shadow rendering, so its own shadow and transmission work can contribute; later postprocessing renders have their own counts. Measure the whole delivered frame with `renderer.info.autoReset = false`, reset once before all shadow/scene/postprocessing work, and read after its final pass. Compile counts or interval samples do not measure a network request.

### Real-device release record

Record target phone, OS/browser, CSS viewport and drawing-buffer size; cold-load bytes and first usable product; closest/farthest zoom and full orbit; every finish switch; moving highlight/grain stability; scroll, touch and orientation changes; lost-context recovery and a usable fallback. Profile representative interaction with browser tools. For GPU duration, use an appropriate supported timer query or GPU profiler, and discard disjoint results.

If assets need optimization, reduce invisible geometry, choose texture resolutions from actual zoom requirements, and compare compressed normal maps before shipping. Test decoding and loading separately from steady-state rendering. Preload necessary variants or communicate loading when a choice genuinely requires another asset.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Tiny JPEG; memory still high | Decoded pixels and mipmaps cost more than compressed bytes | Estimate dimensions and format; measure resources and reduce unsuitable maps |
| Low draw count; slow motion | Pixel shading, bandwidth, or post effects dominate | Compare DPR and effects independently; profile the target device |
| Each switch grows counts | New resources allocated without reuse/disposal | Reuse compatible resources; dispose resources after their last owner leaves |
| Desktop passes; phone loses grain or stalls | Different pixels, GPU, memory, and browser | Validate target phones and retain a readable quality preset |

**Reflect:** which quality reduction preserved material identity, and which compromised the product? Put that distinction in the release record.

<div data-mark-done></div>
