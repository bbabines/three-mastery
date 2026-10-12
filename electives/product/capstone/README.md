---
id: product.capstone.page
elective: product
kind: page
concepts: [product.capstone]
---

# A complete product configurator look

> **In short:** A finished product look combines geometry, tactile materials, deliberate reflections, grounding, view coverage, and device evidence.
>
> **Used for:** Storefront configurators, reference reconstruction, finish approval, and transferring a studio recipe to another product.

## Evidence

The featured quality target, captured from the live WebGi site at its default view and from the front:

![Classic watch on the live WebGi site, default view: blue leather, reflective case, and graduated studio highlights](/assets/reference/classic-watch/reference-webgi.png)

![The same watch from the front, at the same distance and height](/assets/reference/classic-watch/reference-webgi-front.png)

The featured watch uses the same metal studio family that helped explain the jewelry look. Its external leather normal is saved with repeat `[3, 3]`, `flipY: true`, and normal strength `[0.3, -0.3]`. The source case material `metal` has roughness about 0.048 and metalness 1; `metal_cover` is rougher, about 0.285. The file also saves anisotropy settings for it, but the live site doesn't render them. Its leather `strap` has roughness about 0.473 **and metalness about 0.326**.

That last value is an artist's saved decision, not a physical rule for leather. Ordinary leather is a dielectric: metalness 0 is the grounded baseline. Compare them under the same environment, color, roughness, and normal settings before deciding what serves the product. A navy leather preset and a brown leather preset also need separate view checks.

The reference is a quality target, not evidence that ordinary GLTFLoader reproduces WebGi. The shared stage restores the standard materials, the studio, and the external normal, then rebuilds the rest of the live look with native parts: the GLB's key light and its shadow, the white reflective ground, and the finishing chain (ambient occlusion, a 32-frame still, bloom, contrast 1.1). What still differs: WebGi's screen-space reflections, which the stage doesn't have; how its ambient occlusion darkens; the floor reflection, which is a mirror render here; and bloom, which glows only from the product here. Judge those differences individually; do not “correct” several unrelated settings to force a match.

## Why it works

**Analogy: a product photography set with a release checklist.** Good surfaces need a well-arranged studio; the studio needs a useful camera; the image needs restrained finishing. A configurator then has to remain readable when the customer walks around it and changes its finish.

The controls below keep these decisions separate. The configurator starts in the stage's reference look, with authored panels in place of the source studio. Its grounding is the stage's reference ground under the GLB's key light: a contact shadow, the key light's soft shadow, and a floor reflection. **Grounding: off** removes the ground; the key light stays on. The crystal casts no shadow, as in the source file. The **reference camera** control returns to WebGi's default or front view, so your saves line up with the two captures.

### Exercise 1 · Deliver the watch configurator

Start with **source artist settings**, source navy, and source case. Save a reference comparison. Switch only the strap interpretation to **dielectric leather** and inspect highlight behavior and grain. Choose and explain your interpretation. Then build one studio that works for navy, chestnut, and black leather paired with source case, polished silver, and satin gold.

<div data-scene="configurator"></div>

**Acceptance checklist:**

- Preserve believable geometry, readable bevels, and intact dial/stitching detail.
- Keep leather grain appropriately scaled and visible at inspection distance; avoid embossed-looking excess normal strength.
- Retain recognizable metal across dark and bright reflected regions; useful gradients reveal curvature.
- Inspect all nine color/finish combinations at near and far zoom limits. Capture each required orbit sheet and settings; check low and high elevations and continuous movement.
- Retain grounding without an excessive dark halo. If another product moves or changes shape, validate its shadow again.
- Pick a camera and finishing setup from the preceding unit; explain any change to bloom, sampling, or tone mapping. This capstone starts with the stage's full finishing chain.
- The studio follows the camera here, as on WebGi, so every orbit tile sees the panels in the same place. If your storefront fixes the studio to the world instead, check the orbit the way Lighting throughout a full orbit does.
- Record quality presets, rendering counts, frame intervals, loading behavior, and repeated variant-switch stability. Run the real-device checklist on target phones before a production release.
- Save comparison PNGs, JSON settings, orbit sheets, a short remaining-differences record, and the actual device/browser record. A screenshot alone is not completion evidence.

**Accept:** a reviewer can load your recorded settings, inspect the same finish/view matrix, and tell why each lighting, material, and quality choice was made. The bundled lab supplies the complete configurator exercise; passing it requires your inspection, not a pixel-overlap score. Phone validation remains unclaimed until actually performed.

### Exercise 2 · Diagnose a broken stack

The second watch begins with a uniform studio (the key light stays on), its external leather normal removed, and exposure increased. Restore one component, save the result, and identify what it actually fixed. Restore the others separately. Compare artist metalness against dielectric leather after the image is readable.

<div data-scene="diagnosis"></div>

**Accept:** distinguish missing reflection structure from missing surface shading and excessive exposure. State what each repair cannot supply: a normal map cannot fix silhouette, exposure cannot arrange panels, and panels cannot restore a missing texture. Apply the same diagnostic sequence to one of your own products before choosing new assets.

## The code

The working configurator and diagnosis live in `scenes.ts`; the stage owns imported resources and exports the active settings.

```ts
// Grounded leather interpretation; keep other inputs unchanged for comparison.
strap.metalness = 0;
strap.roughness = 0.47318500132966934;
strap.normalMap = normalTexture;
strap.normalScale.set(0.3, -0.3);
normalTexture.repeat.set(3, 3);

// A color variant reuses the loaded material and textures.
strap.color.setHex(0x693b25);
metal.color.setHex(0xc5a462);
metal.metalness = 1;
metal.roughness = 0.3;

// Authored surroundings are captured/filterable environment illumination.
lab.setPanels({ count: 4, width: 0.45, softness: 0.7, background: 0.12 });

// The stage's reference look, one part at a time.
lab.setReferenceLook({ ground: false }); // grounding off; key light and finishing stay
lab.setView('front');                    // WebGi's front view, in stage units
lab.captureOrbit(); // 12 azimuths × 3 elevations, plus settings JSON
```

For your storefront, carry over the loader/texture restoration, calibrated materials, authored environment, camera limits, grounding method, output chain, and quality choices as separate responsibilities. This asset is a study reference; check its reuse terms before using it as commercial merchandise or redistributing it.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Copying numbers still misses the reference | Different rendering features or absent textures | Audit feature support and restored maps before tuning by eye |
| Leather resembles painted metal | Artist metalness copied as a substance rule | Compare metalness 0 under locked lighting and explain the chosen interpretation |
| One finish succeeds; another disappears | Lighting approved against only one material | Inspect the complete finish/view matrix and repair its weakest cases |
| Beautiful still; poor interaction | Motion sampling, loading, and devices untested | Inspect continuous orbit, variant switching, cold load, and actual phones |

**Reflect:** name the strongest improvement from geometry, material, lighting, and finishing separately. Name one remaining limitation and the evidence needed to resolve it.

<div data-mark-done></div>
