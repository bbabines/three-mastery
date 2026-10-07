# Jewelry look-dev: reference files

The pages take apart iJewel's playground (playground.ijewel3d.com/v2/), so they load iJewel's own files from `assets/reference/ijewel/`. They're committed so they travel between machines (Brad's call, Oct 7, 2026). They're iJewel's, for study only, and never ship in the Shopify app.

```
assets/reference/ijewel/
  Spring.glb                         the Spring ring, exported from the playground
  hdr/env_metal_011_172e446a13.exr   the environment the metal reflects
  hdr/env_gem_001_b9c4533e70.exr     the environment the gems reflect
  materials/                         .pmat and .dmat files, from fetch-materials.mjs
  materials/metals/                  iJewel's five polished metal presets
  textures/                          the wood's two maps, from fetch-materials.mjs
```

To fetch the material files and textures that `Spring.glb` points to again:

```bash
node electives/jewelry/tools/fetch-materials.mjs
```

`tools/exr-peek.mjs` prints an environment's brightness and writes a preview at a chosen exposure, since an `.exr` opened as a normal image looks blank white.

## What the reference uses

Measured from the files on Oct 7, 2026. Pages quote these numbers, so measure again before changing one.

**The render setup** (`Spring.glb`'s `WEBGI_viewer` scene extension):

| Setting | Value |
| --- | --- |
| Tone mapping | ACES Filmic (`toneMapping: 4`), exposure 1, contrast 1.1, saturation 1 |
| Anti-aliasing | Progressive: 32 frames with sub-pixel jitter, averaged once the camera stops; TAA while it moves |
| Screen-space reflections | On: 16 steps, intensity 1 |
| Ambient occlusion | SSAO, intensity 0.25 (rebuilt with three.js's `GTAOPass` at radius 0.2, scale 2, picked by eye) |
| Bloom | Threshold 2, intensity 0.2, 4 iterations, radius 0.6 (three.js's `UnrealBloomPass` needs a strength near 0.03 for the same faint glow) |
| Ground | Baked soft shadow (a randomized light, up to 400 frames) on a white ground 8 units across, roughness 1, opacity 0.95 |
| Background | White, not tone mapped; the ground isn't tone mapped either (`tonemapGround: false`) |
| Environment | Intensity 1, fixed direction; the gems get their own environment (the `Diamond` plugin's `envMap`) |
| Camera | 15° field of view, a long product-photo lens; orbit only above the ground; opens on the view from above. The four saved views are too close to fit the ring at 15°, so the viewer must fit the model to them |
| Off | Chromatic aberration, vignette, LUT, film grain, depth of field, SSGI, contact shadows |

**The environments** (`tools/exr-peek.mjs`; 1.0 is white paper): both 2048 × 1024.

| | Median | 99th percentile | Brightest | Brighter than 1.0 |
| --- | --- | --- | --- | --- |
| Metal (`env_metal_011`) | 1.28 | 4.2 | 84 | 61% of the image |
| Gem (`env_gem_001`) | 0.39 | 21.7 | 284.5 | 9.7% |

The metal one is a fake studio: a bright gray room with black panels and a few small hot lights. The gem one is a real room: chandeliers, ring lights, and windows, nearly gray.

**The materials:**

| Material | Settings |
| --- | --- |
| Polished metals (`materials/metals/`) | Rose gold `#f2af83`, yellow gold `#fec07a`, white gold `#c2c2c3`: metalness 1, roughness 0. Platinum `#b6b6b6`: metalness 0.88, roughness 0. Silver `#fcfcfc`: metalness 0.88, roughness 0.065. No textures. |
| Ceramic (`ceramic_rosa`, `ceramic_red_2`) | A color, metalness 0, roughness 0, no textures |
| Pearl (`pearl_rose_2`) | Color `#ba7547`, metalness 0.97, roughness 0.25, plus iJewel's thin-film layer (an iridescent shimmer) |
| Wood (`wood_brown`) | A 1024² color map (sRGB, repeating) and a 1024² grayscale copy of it as the roughness map (linear), roughness 0.30, metalness 0.14, triplanar mapping (scale 1, blend 6) |
| Diamonds (`1_gem_diamond_white_2`, `_3`) | Refractive index 2.6 (a real diamond is 2.42), 5 ray bounces, dispersion 0, absorption 1, reflectivity 0.5, environment intensity 1.3 |
| Ruby (`1_gem_ruby_1`) | `#e14276`, index 1.77, absorption 1.6, color boost (1.3, 0.16, 0.9) |
| Yellow sapphire (`gem_sapphire_yellow`) | `#f4e2ae`, index 1.77, absorption 1.3, reflectivity 0.3, boost (1.9, 1.8, 0.5) |
| Emerald (`1_gem_emerald_2`) | `#4fd5b3`, index 1.58, absorption 1.8, reflectivity 0.31, boost (−0.3, 1, 1) |

The `.dmat` files also have `squashFactor` 0.98 and `geometryFactor` 0.5, which iJewel doesn't document. The pages say so rather than guess.
