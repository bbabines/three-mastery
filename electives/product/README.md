# Product Look Development

Ten domains and a configurator capstone, built around the **classic watch on [WebGi](https://webgi.dev/)**. Its polished case, brushed surfaces, blue leather, modeled stitching, and crystal let the same real asset carry lighting, tactile-material, and delivery lessons.

Open `/harness/?drill=electives/product/reference-color`. The elective appears in the Look dev and Everything tracks. Each unit has two working watch experiments, shown code, visual exercises, acceptance checklists, and a Mark done button. Nothing is timed. Save comparison PNGs and settings JSON from the controls; explain what changed before marking a page done. Pause live preview for static comparisons on a slow renderer; controls and exports still draw their changed state. Resume for orbit motion, shimmer inspection, and frame-interval measurements. These are visual study exercises, not blank-file coding drills or automatically graded artistic judgments.

| Order | Domain | Practice |
| --- | --- | --- |
| 1 | References, color, and exposure | Establish a controlled baseline; repair color-space mistakes |
| 2 | Geometry and manufacturing detail | Read normals, bevels, silhouette, and modeled seams |
| 3 | Tactile materials and texture scale | Isolate normal, roughness, grain scale, sheen, and anisotropy |
| 4 | Light sources and readable form | Change direction, source size, falloff, and fill independently |
| 5 | Reflection and HDR design | Shape graduated panels and dark regions; separate source softness from roughness |
| 6 | Shadows and grounding | Repair shadow coverage/bias; expose frozen shadows after movement |
| 7 | Indirect light and scene context | Compare explicit fill, diffuse probes, lightmaps, and AO approximations |
| 8 | Lighting throughout a full orbit | Inspect camera/product/environment rotation and every allowed view |
| 9 | Camera and image finishing | Compare lenses at matched framing, sampling, and restrained bloom |
| 10 | Browser delivery and validation | Measure counts, frame intervals, texture estimates, and quality compromises |
| 11 | Configurator capstone | Combine finish variants, tactile detail, reflection coverage, grounding, and exports |

## The reference files

`assets/reference/classic-watch/` holds the untouched GLB, its studio EXR, external leather normal, six extracted embedded images, the viewer configuration saved in the GLB, measured audit, two captures of the live site, and a SHA-256 manifest. They travel with the repository. The public site's `watch-2.glb` and its documented `classic-watch.glb` sample had the same SHA-256 when checked on October 11, 2026.

The live site at webgi.dev is the newer threepipe-based WebGi (three r163 underneath, with the same physical light units as r186), set up by its own page code. The settings saved inside the GLB (`viewer.json`, and the plugin settings in `audit.json`) come from WebGi 0.9.22, and much of them isn't what the live site renders. Where the two disagree, the stage follows what the live site renders, recorded in `reference-capture.json`.

To refresh the source files and verify what changed:

```bash
node electives/product/tools/fetch-reference.mjs
node electives/product/tools/measure-hdr.mjs
node electives/product/tools/capture-source.mjs --headed
```

`capture-source.mjs` uses the installed Chrome on the real GPU (`--headed` opens a visible window; it refuses a software renderer). It loads the live site in light mode, turns off the interaction prompt, puts the hands at the GLB's rest pose, pins the site's showcase effects, waits for its 32-frame accumulation to settle, and saves `reference-webgi.png` (WebGi's default view) and `reference-webgi-front.png` (same distance and height, facing the dial). `reference-capture.json` records both cameras and the live light, ground, environment, tone-mapping, and effect settings. The current captures are from October 12, 2026. `fetch-reference.mjs` rewrites `manifest.json` without the two captures, so re-add their entries after running it.

Inspect `manifest.json` before accepting a changed reference. `viewer.json` preserves the complete settings saved in the GLB. `audit.json` records material values and extensions; `hdr-measurements.json` records the EXR measurements. Scripts fetch only the URLs in the known sample configuration. A missing or failed reference is reported visibly; no lower-quality substitute silently replaces the watch.

These third-party assets are retained as study references. A code repository's license does not establish a separate commercial license for the watch, textures, or HDR; obtain suitable rights or use your own assets before shipping them in a storefront.

## What makes this particular look

- The studio EXR is 2048 × 1024. Its linear brightness has median **1.214**, 99th percentile **9.118**, and maximum **90.195**; about **80.58%** of pixels are brighter than 1. These are measured file values, not calibrated white-paper brightness.
- The live site lights with the EXR at intensity **1** (the GLB saves an older **0.771**, which isn't used) and turns it by **3.9472152127 radians**. Its `fixedEnvMapDirection: true` keeps the studio fixed to the camera, so orbiting never moves the reflections. The stage reads both from `reference-capture.json`, maps the rotation to `scene.environmentRotation`, and, by default, turns the studio with the camera too. It lights at **0.9**, not 1: see "Original versus native" below.
- The GLB's one directional light, `light_0` (intensity **20**, casts a shadow softened by PCF radius about **1.07**), is the live key light. It makes the soft ground shadow behind and to the right of the watch. The stage keeps it on with its saved shadow settings, moved out of the model so turning the product doesn't turn the light.
- The crystal (`glass`) is the material GLTFLoader builds: transmission 1, roughness 0, double-sided. In r186 a double-sided transmissive crystal draws its own back faces into its transmission, which washes the dial out to a hazy grey-blue, so the stage sets `glass.side = THREE.FrontSide`. r186 also reads what's behind a transmissive surface through a smoothing filter, a little blurrier than its roughness asks for, so even this perfectly smooth crystal softened the hands. The stage's crystal reads the sharp picture directly while its roughness is 0 (`sharpenTransmission` in `stage.ts`), and the hands come out crisp, as on WebGi.
- The ground is WebGi's ContactShadowGroundPlugin: a white floor (roughness **0.25**, metalness **0.782**) that isn't tone mapped, with a blurred contact shadow, `light_0`'s shadow, and reflections of the watch.
- Finishing on the live site: ACES tone mapping, exposure **1**, contrast **1.1**; SSAO (ambient occlusion) at **0.25**; screen-space reflections; bloom with threshold **1.82**; SSAA, TAA, and a **32**-frame progressive still; HDR values capped at **8**. Off: depth of field, SSGI, and WebGi's anisotropy plugin, so the anisotropy saved on the cover and dial isn't part of the reference look.
- The strap uses roughness **0.4731850013** and metalness **0.3256803475**. That metalness is an artistic reference choice. The lessons compare it with a dielectric leather value of 0 instead of teaching it as physically correct leather.
- Its external leather normal is absent from standard glTF `normalTexture`. WebGi stores it in `WEBGI_material_extras`, with repeat **3 × 3**, `flipY: true`, and normal scale **(0.3, −0.3)**. GLTFLoader keeps the extension data but does not restore this map. Our stage does so explicitly.
- The file contains **21 mesh primitives** and **10 materials**, plus cameras and `light_0`.

## Original versus native study rendering

`reference-webgi.png` and `reference-webgi-front.png` capture the live site as the visual target. The lessons render the same geometry, standard glTF materials, external leather normal, and HDR in pinned three.js r186.

Every page starts from the stage's **reference look**, rebuilt from native r186 parts:

- the studio EXR on a white background, following the camera, at a calibrated **0.9** (below);
- `light_0` and its shadow;
- the reference ground (`ground.ts`): a white floor that isn't tone mapped, roughness 0.25, metalness 0.782, a contact shadow from a blurred depth picture taken below the floor (used as the floor's `aoMap`, and drawn again only when the watch or the ground moves), `light_0`'s shadow, and a planar mirror reflection;
- the finishing chain (`finishing.ts`): GTAO, three.js's ambient occlusion, worked out first with the crystal left out, then applied inside the watch's own materials to environment light only, as WebGi's SSAO is → white background and scene → 32 jittered frames averaged, HDR capped at 8 → `UnrealBloomPass` (strength 0.06, threshold 1.82, WebGi's soft start, glow only from the product) → output with contrast 1.1;
- WebGi's default camera from `reference-capture.json` (about 13.6 stage units from the watch), with its front view one control away.

Stills settle over 32 frames, and any change starts them again. Only a frame's first sample (all a moving view shows) uses 4× MSAA; the other 31 skip it, since their sub-pixel shifts already smooth the edges. A PNG export saves a settled still; orbit-sheet tiles use 2 frames each. Labs turn parts off with `lab.setReferenceLook({light, ground, finishing, studioFollowsCamera})` when they need to isolate one variable, and each page says what it turned off.

**The studio calibration.** With the crystal hidden and the key light off, the stage came out 10–20% brighter than WebGi on the dial, case, floor, and strap, though the HDR, its rotation, and intensity 1 all match. The likely cause is a change inside three.js between WebGi's r163 and our r186. When a surface is partly metal, like the floor (metalness 0.78) or the dial (0.7), r163 cuts its diffuse (matte) share of studio light by everything the surface reflects; r186 cuts it only by what the non-metal part reflects, so the surface ends up brighter. r163 also uses an older formula for how much studio light a surface reflects. Rebuilding those two r163 formulas in the stage's shaders moved the dial, case, and floor shadow toward WebGi but left the floor shadow too dark, so the cause isn't fully pinned. The stage instead multiplies the live value by one factor, `ENVIRONMENT_CALIBRATION = 0.9` in `stage.ts`, chosen by measuring both captures region by region. `lab.environmentCalibration` holds the source value (1), the factor, and the result, and `lab.useCalibratedEnvironment(false)` shows the source value for comparison.

What still differs from WebGi:

- WebGi's screen-space reflections put dark watch parts into the bezel and dial; the stage reflects only the studio, so its dial stays about 3 levels (out of 255) brighter in the default view.
- One factor can't fit every region: the front view's case comes out about 7 levels darker than WebGi's, and the strap about 3 darker.
- GTAO isn't WebGi's SSAO. Measured on WebGi, its occlusion darkens the case about 7 levels and the dial about 3; the stage's, at its chosen strength, about 3 and under 1. Stronger GTAO made the strap darker than WebGi's, so the strength is a compromise.
- The leather grain on the lower strap looks sharper and more contrasty than WebGi's softer grain, which is most of the remaining difference there.
- The floor reflection is a planar mirror render, not screen-space reflections.
- Bloom glows only from the product.
- At the product's outline a pixel mixes tone-mapped product with untone-mapped background or floor, a habit the stage shares with WebGi's "don't tone map" flag. The stage caps the untone-mapped share at white so a bright edge doesn't clip to pure white, but the blend is still an approximation.

Measured against the October 12 captures, the earlier stage was off by **18.24** on average per color channel (sRGB, 0–255) at the default view and **16.42** at the front view; the reference look was off by **3.72** and **2.58** before the October 12 review fixes and is now off by **3.09** and **2.33**. The cost is real but lower than before those fixes. In GPU time on Brad's Mac (M4 Pro, 657 × 966 canvas) a still's sample now takes about **60%** of what it did (DPR 1 and DPR 2 alike), and draw calls fell from about 142 to 118 a frame; the earlier, plainer stage drew 43. `VALIDATION.md` has the numbers and how they were taken. Treat them as one desktop's numbers.

Settings in the finishing chain belong to its native passes; source numbers are not copied into different algorithms as if equivalent. The watch is fitted to three study units for consistent experiments; its original physical unit was not established from the file.

An environment lights and reflects independently of the background. Reflection panels here are authored into brightness panoramas and pre-blurred for each roughness by PMREM; ordinary scene planes would not automatically enter an environment reflection. A uniform environment can erase tactile cues; a detailed one can clutter polished metal. Broad gradients plus deliberate dark regions preserve both readability and definition.

Each teaching panel adds up to 8 in linear brightness above the chosen background; overlap adds light. Panel width is an angular half-width. Changing count or width changes total illumination as well as coverage, so these controls are not an experiment at fixed total energy.

## Evidence and verification

Save settings with every comparison image. The orbit exporter produces **12 azimuths × 3 elevations (15°, 35°, 65°)** at the current zoom and records that distance in a companion JSON file. Repeat at your closest and farthest allowed zoom, with each finish. It preserves the experiment's settings and restores the camera afterward.

Browser smoke checks exercise scene controls and verify downloads without writing learner progress. They do not certify photorealism or physical-device performance; use the visual checklists and test actual target phones. Browser frame intervals are not GPU timings, and CPU array byte estimates are not measured VRAM allocations. The two product scripts use Playwright's own Chromium when it's downloaded and fall back to the installed Chrome when it isn't; set `PRODUCT_HEADED=1` for a visible window, since headless Chrome can stall animation frames.

```bash
node --import tsx --test scripts/lib/electives.test.ts
node scripts/verify-product.mjs
node scripts/verify-product-state.mjs
npm run typecheck
npm run verify
npm run coverage
```

`VALIDATION.md` records this implementation's checks and remaining evidence limits.
