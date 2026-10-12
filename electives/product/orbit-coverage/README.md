---
id: product.orbit-coverage.page
elective: product
kind: page
concepts: [product.orbit-coverage]
---

# Lighting throughout a full orbit

> **In short:** Orbit coverage keeps a product's shape and finish readable from every allowed viewing position.
>
> **Used for:** Configurators, inspection tools, turntables, and galleries with selectable finishes.

## Evidence

The watch saves a 25° camera, a fixed environment direction, unrestricted horizontal orbit, and a vertical orbit limited to the upper hemisphere. Those are choices in `assets/reference/classic-watch/audit.json`, not proof that every view succeeds. Its saved distances 3–12 belong to the original model scale; this lab fits the watch to three units, so distances here are chosen for this stage.

The reference environment is `env_metal_058_b_74127c4d30.exr`. Bright and dark regions sweep through the case as the view changes. The leather needs a useful directional change in illumination to reveal its normal map. Even perfectly calibrated materials can lose definition at an unfavorable angle.

## Why it works

**Analogy: walking around a shop window.** Walking changes which surroundings reflect toward your eye. Turning the merchandise also changes its orientation relative to the lamps. Moving the lamps changes illumination while your viewpoint stays put.

Those are three separate tests. Camera-following panels can be a deliberate presentation technique, but they describe moving lights: highlights travel differently, and a world-fixed ground shadow can become inconsistent with them. This lab uses world-fixed environments.

### Exercise 1 · Separate the three movements

Use **rotate** to compare camera, product, and environment movement. Sweep **turn** around the watch, then repeat at low and high **elevation**. Change only one control at a time. Locate a case highlight and a patch of leather grain and describe what moves.

<div data-scene="directions"></div>

**Accept:** you can name which movement changes viewing direction, which changes the product relative to the lights, and which changes the lights. You identify one weak angle without changing exposure to conceal it.

### Exercise 2 · Repair the weakest finish/view combination

Pick each **finish** and export its orbit sheet at both **view distance** limits. Each sheet includes 12 azimuths at three elevations. Adjust panel count and width to repair the least readable views; keep the material and exposure fixed during that repair. Repeat exports after the change.

<div data-scene="matrix"></div>

**Accept:** every permitted view retains identifiable metal, visible leather at the close limit, readable edges, and controlled highlights. Natural brightness variation is allowed. Document remaining black patches, clipping, and hidden details by finish and angle; a contact sheet is review evidence, not a realism score. Orbit continuously too: still tiles miss distracting highlight motion. If your app permits underside views, extend its test elevations below the horizon.

## The code

The runnable comparisons live in `scenes.ts`.

```ts
// Orbit the camera around a stationary product and studio.
camera.position.setFromSphericalCoords(radius, polar, azimuth)
  .add(controls.target);
controls.update();

// Separate experiments; restore the initial product pose first.
model.quaternion.copy(original);
model.rotateY(azimuth);                  // product relative to studio
scene.environmentRotation.y = azimuth;  // studio relative to product
```

Do not rotate all three together and conclude that coverage improved. Record the environment, finish, camera distance, elevation, and exposure with the screenshots so a later revision can be compared.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Front looks good; rear is black | Panels were arranged for one camera | Inspect the full orbit and add broad coverage while retaining dark boundaries |
| Grain disappears at most angles | Broad uniform fill removes useful variation | Restore directional gradients; check texture scale and screen resolution |
| Highlights stick to the screen | Environment follows the camera | Use fixed lighting or explicitly approve that presentation choice against shadows |
| Export looks fine; dragging flickers | Thin specular features are undersampled | Inspect motion and tune resolution, roughness, filtering, and finishing |

**Reflect:** which weak view required a lighting change, and which required a different material or camera limit? Keep those causes separate in your saved evidence.

<div data-mark-done></div>
