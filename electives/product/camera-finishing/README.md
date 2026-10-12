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

The watch's saved setup uses a 25° field of view, Progressive with 32 frames, SSAO intensity 0.25, screen-space reflections, exposure 1, and contrast 1.1. Its Bloom plugin stores threshold 1.82, intensity 0.39, and radius 0.6. See `assets/reference/classic-watch/audit.json`.

Those belong to WebGi's renderer. Its bloom intensity is not `UnrealBloomPass.strength`, and its progressive accumulation is not three.js's ordinary MSAA. The lab restores the model, external leather normal, and environment; it demonstrates a separate three.js finishing chain, with bloom strengths 0.035 and 0.3 chosen for comparison. It does not reproduce the proprietary passes or claim the same finished image.

## Why it works

**Analogy: photograph the watch, then process the photograph.** Camera position controls relative near/far sizes. Field of view controls how much fits in the picture. To retain framing with a narrower lens, you move farther away; that movement reduces perspective exaggeration.

Anti-aliasing addresses sampling. MSAA primarily improves triangle boundaries. A tiny specular highlight or leather grain pattern inside a triangle can still shimmer in motion. Higher resolution, appropriate texture filtering, sufficient roughness, and temporal methods solve different parts of that problem. Increasing normal strength can make it worse.

Bloom spreads bright light before output conversion. It can suggest a lens response, but excessive bloom erases grain, washes out metal edges, and makes a white background glow. Tone mapping compresses HDR values; output color conversion prepares those values for the display. Apply that finishing conversion once.

### Exercise 1 · Compare lenses with matched framing

Compare 15°, 25°, and 65° with **framing: matched**. Inspect near/far strap size and case depth. Then choose **fixed distance** to separate cropping from camera movement. Orbit to see how your chosen lens affects product inspection.

<div data-scene="lens"></div>

**Accept:** explain why matched framing changes perspective and why changing field of view at one stationary position changes the crop. Choose a lens that preserves the product's proportions without making inspection awkward.

### Exercise 2 · Finish without hiding the material

Begin at DPR 1, bloom off, and offscreen samples off. Toggle continuous orbit; inspect the case edge, moving highlights, and leather grain. Compare DPR 2 and requested four-sample MSAA separately. Stop moving, then compare restrained and excessive bloom. Change its threshold; find whether white background or useful detail begins to glow. Finally compare tone mappings with the same exposure.

<div data-scene="finish"></div>

**Accept:** save still screenshots and inspect motion for each relevant comparison. Pick settings that preserve grain and highlight boundaries; identify an artifact that MSAA does not remove. Requested samples are bounded by device support, not a promise of identical hardware results. A still screenshot cannot prove motion is stable.

## The code

These are the exact APIs used in `scenes.ts`. The scene updates its composer size with renderer dimensions and pixel ratio, uses it for screenshots/orbit capture, and disposes its passes on leaving.

```ts
camera.fov = 25;
camera.updateProjectionMatrix();
renderer.setPixelRatio(1.5);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(world, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.035, 0.6, 1.82);
composer.addPass(bloom);               // optional HDR glow
composer.addPass(new OutputPass());   // tone mapping + output conversion
composer.render();                   // instead of drawing the scene directly
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
