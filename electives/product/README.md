# Product Look Development

Ten domains and a configurator capstone, built around the **classic watch on [WebGi](https://webgi.dev/)**. Its polished case, brushed surfaces, blue leather, modeled stitching, and crystal let the same real asset carry lighting, tactile-material, and delivery lessons.

Open `/harness/?drill=electives/product/reference-color`. The elective appears in Tech art and Everything. Each unit has two working watch experiments, shown code, visual exercises, acceptance checklists, and a Mark done button. Nothing is timed. Save comparison PNGs and settings JSON from the controls; explain what changed before marking a page done. Pause live preview for static comparisons on a slow renderer; controls and exports still draw their changed state. Resume for orbit motion, shimmer inspection, and frame-interval measurements. These are visual study exercises, not blank-file coding drills or automatically graded artistic judgments.

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

`assets/reference/classic-watch/` holds the untouched GLB, its studio EXR, external leather normal, six extracted embedded images, original viewer configuration, measured audit, source-render capture, and SHA-256 manifest. They travel with the repository. The public site's `watch-2.glb` and its documented `classic-watch.glb` sample had the same SHA-256 when checked on October 11, 2026.

To refresh the source files and verify what changed:

```bash
node electives/product/tools/fetch-reference.mjs
node electives/product/tools/measure-hdr.mjs
node electives/product/tools/capture-source.mjs
```

Inspect `manifest.json` before accepting a changed reference. `viewer.json` preserves the complete original WebGi settings. `audit.json` records material values and extensions; `hdr-measurements.json` records the EXR measurements. Scripts fetch only the URLs in the known sample configuration. A missing or failed reference is reported visibly; no lower-quality substitute silently replaces the watch.

These third-party assets are retained as study references. A code repository's license does not establish a separate commercial license for the watch, textures, or HDR; obtain suitable rights or use your own assets before shipping them in a storefront.

## What makes this particular look

- The studio EXR is 2048 × 1024. Linear RGB luminance has median **1.214**, 99th percentile **9.118**, and maximum **90.195**; about **80.58%** is above numeric radiance 1. These are measured file values, not calibrated white-paper brightness.
- The reference uses environment intensity **0.7709139426** and a saved texture rotation of **3.9472152127 radians**. The native study maps that rotation to `scene.environmentRotation.y`; this is an explicit adaptation rather than an undocumented claim about WebGi's direction convention.
- The strap uses roughness **0.4731850013** and metalness **0.3256803475**. That metalness is an artistic reference choice. The lessons compare it with a dielectric leather value of 0 instead of teaching it as physically correct leather.
- Its external leather normal is absent from standard glTF `normalTexture`. WebGi stores it in `WEBGI_material_extras`, with repeat **3 × 3**, `flipY: true`, and normal scale **(0.3, −0.3)**. GLTFLoader keeps the extension data but does not restore this map. Our stage does so explicitly.
- The file contains **21 mesh primitives** and **10 materials**, plus cameras and a directional light associated with its ground setup. The controlled study stage disables imported lighting so each exercise can introduce its own sources.
- WebGi also records directional anisotropy extensions, ACES/exposure 1/contrast 1.1, progressive sampling, reflections, AO, bloom, and ground settings. Presence in the file is distinct from a plugin being enabled. Inspect the original configuration for both.

## Original versus native study rendering

`reference-webgi.png` captures the original public demo as the visual target. The lessons render the same geometry, standard glTF materials, external leather normal, and HDR in pinned three.js r186. They deliberately vary one contribution at a time.

The native baseline does **not** automatically recreate WebGi's custom anisotropy encoding, postprocessing, contrast curve, or ground system. The finishing and capstone units provide named native approximations. Their settings belong to those implementations; source numbers are not copied into different algorithms as if equivalent. The watch is fitted to three study units for consistent experiments; its original physical unit was not established from the file.

An environment lights and reflects independently of the background. Reflection panels here are authored into radiance panoramas and prefiltered by PMREM; ordinary scene planes would not automatically enter an environment reflection. A uniform environment can erase tactile cues; a detailed one can clutter polished metal. Broad gradients plus deliberate dark regions preserve both readability and definition.

Each teaching panel contributes up to 8 linear radiance above the chosen background; overlap adds light. Panel width is an angular half-width. Changing count or width changes total illumination as well as coverage, so these controls are not an experiment at fixed total energy.

## Evidence and verification

Save settings with every comparison image. The orbit exporter produces **12 azimuths × 3 elevations (15°, 35°, 65°)** at the current zoom and records that distance in a companion JSON file. Repeat at your closest and farthest allowed zoom, with each finish. It preserves the experiment's settings and restores the camera afterward.

Browser smoke checks exercise scene controls and verify downloads without writing learner progress. They do not certify photorealism or physical-device performance; use the visual checklists and test actual target phones. Browser frame intervals are not GPU timings, and CPU array byte estimates are not measured VRAM allocations.

```bash
node --import tsx --test scripts/lib/electives.test.ts
node scripts/verify-product.mjs
node scripts/verify-product-state.mjs
npm run typecheck
npm run verify
npm run coverage
```

`VALIDATION.md` records this implementation's checks and remaining evidence limits.
