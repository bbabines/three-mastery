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

This unit measures the stage as every other page shows it: the reference key light and its shadow, the ground's two extra renders (its contact-shadow depth picture and its floor mirror), and the finishing chain. That's a much heavier frame than the bare scene. On Brad's Mac (M4 Pro, a 657 × 966 canvas) it drew about 141 draw calls a frame instead of 43 for the earlier, plainer stage, and a moving frame took about 5 ms at DPR 1 and about 22 ms at DPR 2. Treat those as one desktop's numbers, not a budget. Whatever stack you finally ship must be measured again on the target devices.

## Why it works

**Analogy: packed furniture versus furnished floor space.** A compressed download is the packed parcel. Once decoded, geometry and textures occupy different storage; the renderer also needs environment filtering, framebuffers, shadows, and any postprocessing targets.

DPR scales each buffer dimension. DPR 2 shades four times as many pixels as DPR 1 at the same CSS size. Texture anisotropy improves filtering at oblique angles within device support; it cannot recover detail missing from the texture or screen. KTX2/Basis textures can reduce transfer and GPU storage through supported transcode formats, but their normal-map quality must be checked against the original. Keep normal and roughness data out of sRGB conversion.

Browser frame intervals include scheduling, JavaScript, rendering, refresh-rate limits, and other work. They can expose jank; they are not isolated GPU durations. `renderer.info` supplies draws, triangles, and resource counts, not actual GPU bytes. A phone test requires a phone.

### Exercise 1 · Find the lowest acceptable quality

Compare the **quality** presets while stationary and during continuous orbit. Inspect leather at closest zoom, the rear strap at an oblique angle, case highlights, and dial text. Clear the interval sample after changing the view. Save settings and a comparison PNG for the lowest acceptable preset.

<div data-scene="budget"></div>

**Accept:** explain one visible improvement and its cost. Record buffer dimensions, draw/triangle counts, and interval sample size, median, and p95 (the interval that 95% of frames beat). The map estimate assumes RGBA8 plus a full mip chain when enabled; it excludes EXR, PMREM, render targets, driver overhead, and texture-format differences. Record your device/browser. Do not label these intervals “GPU time” or claim this desktop test passed on a phone.

### Exercise 2 · Verify repeatable variant changes

A real finish swap changes texture sets, and sometimes shader features, not just colors. This scene has two finishes: the reference (scanned leather normal map, polished silver) and a pebbled chestnut strap with warm metal. The pebbled leather's normal and roughness maps are generated in code, a stand-in for a second scanned leather, not a measured material. Its roughness map is a shader feature the reference strap lacks, so it needs its own shader program.

Both finishes' maps and materials are made once, when the scene opens. Then it warms up: `renderer.initTexture` uploads the maps, and `renderer.compileAsync(scene, camera)` compiles each finish's shaders while that finish is applied. The glass is transmissive, so three.js also draws the scene behind it into its own target with tone mapping off, and `compileAsync` can't prepare that pass; the warm-up draws each finish once to cover it. After that, a switch only changes which materials the meshes use.

Inspect both variants. Run **24 variant switches**: it reads the renderer's texture, geometry, and shader program counts, switches 24 times with a draw after each, and reads them again. Set **switch method** to **allocate a new texture each switch (broken)** and run it again: every switch to the pebbled finish makes two new textures and never frees the old ones. Set it back to the correct method and run it once more. Then switch manually while orbiting.

<div data-scene="stability"></div>

**Accept:** with the correct method all three counts stay the same and the readout says PASS; with the broken one the texture count grows by 24 (two maps, twelve switches to pebbled) and it says FAIL. Both variants keep leather grain and metal identity, and manual switching doesn't blank the product. Equal counts alone don't prove there's no leak or hitch: repeat page navigation and profile interaction separately.

## The code

The exact measurements and bounded variant sweep run in `scenes.ts`.

```ts
renderer.setPixelRatio(1.5);
texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
texture.needsUpdate = true;
const buffer = renderer.getDrawingBufferSize(new THREE.Vector2());
const { calls, triangles } = renderer.info.render;
const { geometries, textures } = renderer.info.memory;

// Made once: the second finish's maps and materials.
const pebbledStrap = lab.strap.clone();
pebbledStrap.color.setHex(0x703d22);
pebbledStrap.normalMap = pebbledNormal;
pebbledStrap.roughnessMap = pebbledRoughness; // a shader feature: its own program
pebbledStrap.roughness = 1; // the map supplies the value
const warmMetal = metal.clone();
warmMetal.color.setHex(0xc9a965);

// Warm-up, before the first switch. show() sets each mesh's material for one finish.
for (const texture of [lab.normalTexture, pebbledNormal, pebbledRoughness]) renderer.initTexture(texture);
show('pebbled'); const pebbledReady = renderer.compileAsync(scene, camera);
show('reference'); const referenceReady = renderer.compileAsync(scene, camera);
await Promise.all([pebbledReady, referenceReady]);
show('pebbled'); renderer.render(scene, camera); // covers the glass's transmission pass
show('reference'); renderer.render(scene, camera); // same task: only this frame reaches the screen

// The check: the same three counts before and after 24 switches, each followed by a draw.
const counts = () => ({
  textures: renderer.info.memory.textures,
  geometries: renderer.info.memory.geometries,
  programs: renderer.info.programs.length,
});

// The broken method, on each switch to pebbled: new pixels, a new upload, nothing disposed.
pebbledStrap.normalMap = mapTexture(pebbles.normal.slice(), 'leaked normal');
pebbledStrap.roughnessMap = mapTexture(pebbles.roughness.slice(), 'leaked roughness');

// Leaving the page frees what the scene made.
lab.onLeave(() => {
  pebbledStrap.dispose(); warmMetal.dispose();
  for (const texture of [pebbledNormal, pebbledRoughness, ...leaked]) texture.dispose();
});
```

By default `renderer.info` resets at the start of every `renderer.render` call, so after a multi-pass frame it only holds the last pass. The stage measures the whole frame instead:

```ts
renderer.info.autoReset = false; // set once by the stage
renderer.info.reset();           // at the start of each frame the stage draws
// shadow map, contact-shadow depth, floor mirror, scene, AO, accumulation, bloom, output…
const { calls, triangles } = renderer.info.render; // read after the last pass
```

So the readout's draw and triangle counts cover the whole stage frame, about 141 draws for the reference look. Once the 32-frame still has settled, the stage only copies it to the screen, and the readout keeps the last full frame's counts. Counts are not GPU cost, and neither compile counts nor interval samples measure a network request.

### Real-device release record

Record target phone, OS/browser, CSS viewport and drawing-buffer size; cold-load bytes and first usable product; closest/farthest zoom and full orbit; every finish switch; moving highlight/grain stability; scroll, touch and orientation changes; lost-context recovery and a usable fallback. Profile representative interaction with browser tools. For GPU duration, use an appropriate supported timer query or GPU profiler, and discard disjoint results.

If assets need optimization, reduce invisible geometry, choose texture resolutions from actual zoom requirements, and compare compressed normal maps before shipping. Test decoding and loading separately from steady-state rendering. Preload necessary variants or communicate loading when a choice genuinely requires another asset.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Tiny JPEG; memory still high | Decoded pixels and mipmaps cost more than compressed bytes | Estimate dimensions and format; measure resources and reduce unsuitable maps |
| Low draw count; slow motion | Pixel shading, bandwidth, or post effects dominate | Compare DPR and effects independently; profile the target device |
| Each switch grows counts | New resources allocated without reuse/disposal | Reuse compatible resources; dispose resources after their last owner leaves |
| First switch to a finish stalls | Its shader compiles and its maps upload on first draw | Warm up with `initTexture`, `compileAsync`, and one draw of each finish |
| Desktop passes; phone loses grain or stalls | Different pixels, GPU, memory, and browser | Validate target phones and retain a readable quality preset |

**Reflect:** which quality reduction preserved material identity, and which compromised the product? Put that distinction in the release record.

<div data-mark-done></div>
