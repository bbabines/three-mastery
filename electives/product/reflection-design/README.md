---
id: product.reflection-design.page
elective: product
kind: page
concepts: [product.reflection-design]
---

# Reflection and HDR design

> **Definition:** Reflection design arranges the bright regions, gradients, and dark boundaries a shiny product sees so its finish and curvature stay readable.
>
> **Used for:** Polished watch cases, jewelry, coated bottles, glossy plastic, and studio rigs that must survive a full camera orbit.

## Evidence

The watch's viewer points to **`env_metal_058_b_74127c4d30.exr`**, saved here as `studio.exr`. The live site turns it by **3.947215 radians** and lights at intensity **1** (the file saves an older **0.770914**, which the live site doesn't use). The stage uses the same rotation and turns the intensity down to **0.9**, because three.js r186 lights partly metallic surfaces with more studio light than WebGi's older three.js (the main README explains). The `metal` material has roughness **0.047670**; `metal_cover` is much rougher at **0.284942**. These are source settings, not arbitrary values chosen to compensate for a poor HDR.

The GLB's own key light, `light_0`, stays on in these scenes. It adds one small, sharp highlight to the case that isn't part of the HDR, so switching or turning the environment doesn't move it.

The jewelry investigation already established the underlying design decision: iJewel's Spring metal studio has median brightness **1.28**, dark panels, and **3** separate regions above luminance 8. Its gem environment has median **0.39** and **104** such bright regions. Those are measurements of Spring's two files; they are **not** measurements of this watch's different studio. The live readout below measures the watch file's dimensions, median, 99th percentile, and maximum directly from its local EXR pixels.

A studio HDR is a particular arrangement of reflections. “Studio 9” can depict a believable studio and still place its sources badly for your case, strap, framing, or allowed camera views. Raising brightness cannot rearrange that room.

## Why it works

### Softness can belong to the reflected source

The polished case reflects its surroundings. A broad bright panel draws a bright band; a dark region gives that band a boundary; a graduated panel makes brightness change smoothly across the curve. A photographer can light a diffusion screen unevenly to make a gradient. The metal reflects that gradient without needing to become rough.

**Analogy:** a mirror can reflect a crisp printed gradient. The smooth tones belong to the print, while the mirror is still sharp.

Three controls are distinct:

| Control | Observable change |
| --- | --- |
| Panel angular half-width | The reflected bright region covers more of the curve |
| Panel softness | The source's boundary or gradient becomes smoother |
| Material roughness | The material spreads reflected directions, softening all its environment detail |

The first scene uses an authored panorama, not physical plane meshes. Each neutral panel adds up to **8** linear radiance above the **dark-region brightness**; overlapping panels can add together. **Panel angular half-width** is the angle from panel center to its outer edge, so the full horizontal span is twice that value. Changing count, width, or softness changes both the arrangement and total illumination; these controls do not preserve energy. PMREM, three.js's step that pre-blurs an environment once for each roughness level, then filters the result. It doesn't arrange the room or choose attractive highlights.

The rotation slider is an offset from the reference's own rotation, so 0 is the reference lighting direction.

<div data-scene="studio"></div>

**Exercise · Keep polish, soften the source.** Select **Authored panels**. Restore the polished case, set panel softness to zero, then feather the panels with case roughness fixed. Separately raise roughness to 0.35 with hard panels. Save both comparisons. Explain why one changes the studio's reflected shapes while the other changes the material identity. Switch to **Watch source HDR** to compare the authored result with the asset you chose.

**Exercise · Repair the orbit.** Begin with one panel and a dark surrounding region. Inspect the watch from behind and from both sides. Increase panel count, change angular half-width, and turn the environment until the weakest angles retain useful case definition. Raise the dark-region brightness enough to avoid large unintended black areas, while retaining a visible boundary. Capture an orbit sheet. The stage's studio follows the camera by default, as WebGi's does, so every view sees the panels in the same place; what changes around the orbit is which parts of the watch face them. (Lighting throughout a full orbit compares this with a studio fixed to the world.) Separate improved placement from extra overall illumination in your explanation: adding or widening panels also adds energy. More panels can improve coverage, but too much even coverage flattens shape; no panel count is universally correct.

### Camera, normal, and environment determine the reflected direction

At a chosen surface point, the direction to the camera and the surface normal determine which direction is reflected. Moving the camera changes that direction even when the watch and HDR stay fixed. Turning the watch changes its normals. Rotating the environment changes which source sits in the selected direction.

Click a watch surface and orbit. Green marks the triangle normal, blue points toward the camera, amber points toward the geometric reflected world direction. This is a **triangle mirror diagram**: the actual material uses interpolated vertex normals and possibly normal-map perturbations. It does not claim to show the exact normal-mapped shader sample. The amber arrow is a direction in the world. Which part of the studio it lands on also depends on the stored rotation and, because the stage's studio follows the camera, on where the camera is: orbiting here works like turning the watch in front of a fixed studio.

<div data-scene="directions"></div>

**Exercise · Trace a highlight.** Pick a case triangle and move the camera until its amber direction passes through a different part of the studio. Explain a changed highlight using the camera direction and surface normal. Repeat on the strap: its normal map and higher roughness make the geometric diagram an approximation. Save the chosen point's settings and describe that limitation.

## The code

### Rotate the environment and preserve the finish

```ts
scene.environmentRotation.y = referenceRotation + THREE.MathUtils.degToRad(offset);
metal.roughness = originalRoughness; // 0.047670 from this watch
lab.setPanels({ count, width, softness, background });
```

`lab.setPanels` creates a float panorama and runs `PMREMGenerator.fromEquirectangular`; its implementation is in `electives/product/environment.ts` and `stage.ts`. Rebuilding happens on a control change, not every frame. The `width` parameter is angular **half-width** in radians around the panorama. Source softness is authored into the panorama before PMREM; roughness selects its filtered representation during shading.

### Explain the reflected world direction

```ts
normalMatrix.getNormalMatrix(hit.object.matrixWorld);
worldNormal.copy(hit.face.normal).applyMatrix3(normalMatrix).normalize();
towardCamera.subVectors(camera.position, worldPoint).normalize();
reflected.copy(towardCamera).negate().reflect(worldNormal).normalize();
```

The negative view direction is the incoming ray toward the surface. `Vector3.reflect` returns its direction after reflection about the normalized normal. Transforming the normal to world space keeps both directions in the same space.

### Inspect the source rather than guess from the product

```ts
const stats = measurePanorama(lab.environment.image);
stats.median;
stats.p99;           // 99th percentile: only 1% of pixels are brighter
stats.max;
stats.shareAbove(1);
```

The runnable scene uses the shared analyzer from Jewelry. It reads half floats correctly. Median and percentages count panorama pixels equally, though a pixel near the top or bottom of the panorama covers less of the surroundings than one at the middle, so they aren't a measure of light energy. The brightest pixel's value isn't its brightness on screen after tone mapping either.

## How it goes wrong

| Symptom | Cause | Repair |
| --- | --- | --- |
| Polished metal becomes satin | Roughness was increased to hide a harsh source | Restore material roughness; graduate the source |
| Attractive front, black rear | With a studio fixed to the world, panels cover only the hero angle | Tune the weakest orbit views and their elevations, or let the studio follow the camera |
| A bright plane never reflects in the case | Ordinary environment mapping does not capture scene meshes automatically | Capture panels into an environment map, or use an explicit supported reflection technique |
| More exposure removes all definition | Bright reflected regions clip together | Recover exposure and introduce usable gradients and boundaries |
| A white background gives black metal | Background color and lighting environment are separate | Inspect `scene.environment`, its intensity, and any material environment overrides |

**Acceptance:** preserve polished roughness, explain source softness versus roughness, produce a readable orbit sheet, and retain a useful dark boundary without unintended black coverage. Write why your authored rig improved one weak view and what it cost elsewhere.

<div data-mark-done></div>
