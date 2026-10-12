---
id: product.reference-color.page
elective: product
kind: page
concepts: [product.reference-color]
---

# Reference, color, and exposure

> **In short:** A controlled reference separates a product's surface from the lighting and display choices that change its appearance.
>
> **Used for:** Catalog consistency, paint configurators, leather color approval, and comparing photographs with renders.

## Evidence

The classic watch combines a model, studio lighting file, external leather normal texture, and viewer settings. Its metal base color is `(0.443, 0.443, 0.443)` in linear light, metalness `1`, roughness `0.0477`. That color converts to approximately `#b2b2b2` for an sRGB picker. The viewer records exposure `1`, tone mapping `4`, contrast `1.1`, and saturation `1`.

The study uses ACES Filmic for that recorded tone mapping number. WebGi's contrast and finishing pipeline are separate operations; loading its model into three.js does not reproduce them. This is a controlled reconstruction, not a claim of identical pixels.

![Original WebGi watch: the metal and leather quality target](/assets/reference/classic-watch/reference-webgi.png)

Keep this captured original viewer image as the quality target. The live study explicitly adapts its assets to three.js; unsupported WebGi effects and a different finishing pipeline mean the study is not a pixel-for-pixel replacement.

Compare the curves with exposure fixed. Then adjust exposure while watching the dial lettering and bezel. With **None**, `toneMappingExposure` is ignored: moving that slider does not brighten the render. The three display patches have linear inputs `0.18`, `1`, and `8`; they bypass illumination, so they isolate the display transform. They are not photographed gray cards.

<div data-scene="calibration"></div>

## Why it works

**Exposure** scales scene brightness within the selected tone-mapping operation. **Tone mapping** compresses that brightness into the screen's range. `NoToneMapping` skips that operation and its exposure scaling. Neither repairs the arrangement of reflected panels. Pick a display transform early, then judge lights and materials under it.

**Analogy:** compare paint samples beneath the same lamp. Changing the lamp while changing the paint makes it impossible to tell which change caused the result. A fixed camera, environment, and exposure perform the same job.

**Color space** describes what texture values mean. Base color images normally use sRGB; normal, roughness, and metalness images carry numeric data and use `NoColorSpace`. glTF base color factors already describe linear light. GLTFLoader handles standard glTF textures; do not apply another conversion to the loaded colors.

The watch's custom leather texture needs explicit restoration. Try both deliberate import errors below, then restore each. Exposure stays fixed so brightness cannot conceal the error.

<div data-scene="colorRepair"></div>

The watch is fitted to a largest dimension of three study units. That makes comparisons convenient; it does not establish millimeters or real-world dimensions. Before using measured light distances or texture pixels per centimeter in production, establish the product's physical dimensions and asset scale.

## The code

The controls run these operations in `scenes.ts`.

### Fix the output once

```js
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1; // ignored if toneMapping is NoToneMapping
```

### Read factors and textures correctly

```js
metal.color.setRGB(0.4431372549, 0.4431372549, 0.4431372549); // file: linear
metal.color.set('#b2b2b2'); // picker: sRGB; conversion is automatic
normalTexture.colorSpace = THREE.NoColorSpace;
```

Use a calibrated physical photograph when exact product color matters. The reference viewer's attractive lighting and artistic material values are evidence of its look, not a measurement of the manufactured product.

## Exercises

1. Compare ACES, Neutral, AgX, and None at exposure `1`. Save two views and describe the differences in highlight detail and dial color. Acceptance: the camera and materials match between views, and the difference is attributed to the output curve.
2. Enable each color import error individually and repair it. Acceptance: the metal returns to linear `0.443`, the normal texture returns to data interpretation, and exposure remains `1`.
3. Save the repaired settings and a screenshot. Record which dimensions and physical color facts still need a real product or manufacturer specification. Acceptance: study units are not labeled centimeters.

## How it goes wrong

| Symptom | Cause and repair |
| --- | --- |
| Metal suddenly becomes pale or dark | Factor or picker values were interpreted in the wrong space. Restore the factor as linear. |
| Leather relief looks skewed | A data map was decoded as color. Use `NoColorSpace`. |
| White highlights lose shape | Exposure or output transform clips the useful range. Compare curves and lower exposure before editing materials. |
| Every finish needs a different exposure | Lighting, color interpretation, or material setup is masking the cause. Compare under one fixed baseline. |
| A fitted model is called life-size | Normalization supplied a study size. Obtain actual dimensions before making physical-scale claims. |

Explain which change altered the product itself and which changed only its presentation.

<div data-mark-done></div>
