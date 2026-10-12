---
id: product.camera-finishing.page
elective: product
kind: page
concepts: [product.camera-finishing]
---

# Camera and image finishing

> **In short:** Camera and finishing choices control perspective, moving detail, and how HDR illumination fits a display.
>
> **Used for:** Product photography matching, inspection viewers, animated turntables, and consistent display output.

## Evidence

The live WebGi site renders the watch with a 25° field of view and finishes every frame with: ambient occlusion (SSAO) at 0.25, screen-space reflections, bloom with threshold 1.82, ACES tone mapping at exposure 1 with contrast 1.1, and 32 jittered frames averaged into a still (SSAA, TAA, and its progressive plugin), with HDR values capped at 8. Depth of field and SSGI (screen-space bounce light) are off. These were read from the live site and recorded in `assets/reference/classic-watch/reference-capture.json`.

The stage rebuilds that chain from native three.js passes in `electives/product/finishing.ts`, and every page uses it unless a lab turns it off: the white background, the scene, GTAO (three.js's ambient occlusion pass, on the product only, with the crystal left out), the 32-frame average capped at 8, `UnrealBloomPass` with threshold 1.82 and a soft start like WebGi's, glowing only from the product, and an output pass that tone maps and adds contrast 1.1. WebGi's bloom intensity (0.39 in the GLB's saved settings) isn't on the same scale as `UnrealBloomPass.strength`, so the stage's 0.06 is its own setting, not a copy. The stage has no screen-space reflections; the main README lists what still differs from WebGi.

The second lab drives that same chain but starts it bare: one frame, no offscreen MSAA, no bloom, so you can add each tool on its own. "Restrained" bloom is the stage's 0.06; "excessive" is 0.3.

## Why it works

**Analogy: photograph the watch, then process the photograph.** Camera position controls relative near/far sizes. Field of view controls how much fits in the picture. To retain framing with a narrower lens, you move farther away; that movement reduces perspective exaggeration.

Anti-aliasing addresses sampling. MSAA primarily improves triangle boundaries. A tiny specular highlight or leather grain pattern inside a triangle can still shimmer in motion. Higher resolution, appropriate texture filtering, sufficient roughness, and temporal methods solve different parts of that problem. Increasing normal strength can make it worse.

The stage's still is a temporal method. Each frame shifts the camera by less than a pixel, and the average of 32 smooths edges, tiny highlights, and grain. It only works while the view holds still: any movement or control change starts the average again, so a moving view shows single frames.

Bloom spreads bright light before output conversion. It can suggest a lens response, but excessive bloom erases grain, washes out metal edges, and can make a white background glow (the stage's bloom takes light only from the product, so its background and floor don't). Tone mapping compresses HDR values; output color conversion prepares those values for the display. Apply that finishing conversion once.

### Exercise 1 · Compare lenses with matched framing

Compare 15°, 25°, and 65° with **framing: matched**. Inspect near/far strap size and case depth. Then choose **fixed distance** to separate cropping from camera movement. Orbit to see how your chosen lens affects product inspection.

<div data-scene="lens"></div>

**Accept:** explain why matched framing changes perspective and why changing field of view at one stationary position changes the crop. Choose a lens that preserves the product's proportions without making inspection awkward.

### Exercise 2 · Finish without hiding the material

The lab starts at DPR 1, one frame, no offscreen samples, and bloom off. Toggle continuous orbit; inspect the case edge, moving highlights, and leather grain. Compare DPR 2 and requested four-sample MSAA separately. Stop moving, then switch **still accumulation** to 32 jittered frames and compare the settled still with one frame. Compare restrained and excessive bloom, then lower its threshold until useful detail begins to glow. Turn **ambient occlusion** and **contrast** off and on, one at a time. Finally compare tone mappings with the same exposure.

<div data-scene="finish"></div>

**Accept:** save still screenshots and inspect motion for each relevant comparison. Pick settings that preserve grain and highlight boundaries; identify an artifact that MSAA does not remove and say whether the 32-frame still removes it. Requested samples are bounded by device support, not a promise of identical hardware results. A still screenshot cannot prove motion is stable.

## The code

These are the exact APIs used in `scenes.ts` and the stage. The stage sizes the chain with the renderer and pixel ratio, uses it for screenshots and orbit sheets, and disposes it on leaving; this lab only changes its settings.

```ts
camera.fov = 25;
camera.updateProjectionMatrix();
renderer.setPixelRatio(1.5);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// The stage's chain (electives/product/finishing.ts), drawn instead of renderer.render:
const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.addPass(new BackdropPass());                 // white background, not tone mapped
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new ProductAOPass(scene, camera));   // GTAO on the product only
composer.addPass(new AccumulatePass());               // 32 jittered frames, HDR clamped at 8
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.06, 0.6, 1.82);
composer.addPass(bloom);                              // only light above 1.82 glows
const output = new FinishPass();                      // OutputPass + contrast 1.1
composer.addPass(output);
composer.render();

// This lab's controls change those same passes:
lab.finishing.accumulate.maxSamples = 1;              // one frame instead of 32
composer.renderTarget1.samples = 0;                   // no offscreen MSAA
bloom.strength = 0.3;
output.contrast = 1;
```

The harness's `antialias: true` applies to its default framebuffer. Rendering the scene into a composer target requires that target's own `samples`; it does not inherit default-framebuffer MSAA. This lab exposes that distinction.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Product feels stretched | Camera is too close for matched wide-lens framing | Back away with a narrower field of view |
| Metal sparkles crawl despite smooth edges | Specular detail is smaller than screen pixels | Inspect in motion; improve resolution and material/filtering choices |
| Leather turns hazy | Bloom or clipped illumination buries the grain | Disable bloom, restore exposure, then add restrained finishing |
| Output is unexpectedly pale or dark | Output conversion is missing or applied twice | End the HDR composer chain with one OutputPass |

**Reflect:** which setting improved an actual artifact, and which merely changed the mood? Retain the useful correction in the final configurator.

<div data-mark-done></div>
