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

The watch saves a 25° camera, unrestricted horizontal orbit, a vertical orbit limited to the upper hemisphere, and `fixedEnvMapDirection: true` (in `assets/reference/classic-watch/audit.json`). The live site keeps that last one: its studio stays fixed to the camera, so orbiting never moves the reflections. Those are choices, not proof that every view succeeds. The stage opens at WebGi's own default view, captured from the live site and converted to the stage's units; this lab's zoom limits are set around that view.

The reference environment is `env_metal_058_b_74127c4d30.exr`. Bright and dark regions sweep through the case as the view changes. The leather needs a useful directional change in illumination to reveal its normal map. Even perfectly calibrated materials can lose definition at an unfavorable angle.

## Why it works

**Analogy: walking around a shop window.** Walking changes which surroundings reflect toward your eye. Turning the merchandise also changes its orientation relative to the lamps. Moving the lamps changes illumination while your viewpoint stays put.

Those are three separate tests. They're only separate when the studio stays put in the world, so both scenes here fix it there, unlike the rest of the stage.

That's a real choice with a trade-off. A studio that follows the camera (WebGi's choice) gives every view the same well-placed reflections, but they no longer belong to a place, so they can disagree with a ground shadow that stays put. A studio fixed in the world keeps reflections and shadows consistent as you walk around, but then every angle has to be lit well on its own, which is what this page's orbit sheet tests. Either way, the key light, `light_0`, stays fixed in the world; turning the studio doesn't move it.

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
lab.setReferenceLook({ studioFollowsCamera: false }); // studio fixed in the world

// Orbit the camera around a stationary product and studio.
camera.position.setFromSphericalCoords(radius, polar, azimuth)
  .add(controls.target);
controls.update();

// Separate experiments; restore the initial product pose first.
model.quaternion.copy(original);
model.rotateY(azimuth);                                   // product relative to studio
scene.environmentRotation.y = studioRotation + azimuth;  // studio relative to product
```

Do not rotate all three together and conclude that coverage improved. Record the environment, finish, camera distance, elevation, and exposure with the screenshots so a later revision can be compared.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Front looks good; rear is black | Panels were arranged for one camera | Inspect the full orbit and add broad coverage while retaining dark boundaries |
| Grain disappears at most angles | Broad uniform fill removes useful variation | Restore directional gradients; check texture scale and screen resolution |
| Highlights stay put on screen while the watch seems to turn | The studio follows the camera (WebGi's choice) | Fine for a hero look; fix the studio to the world if reflections must agree with the ground shadow |
| Export looks fine; dragging flickers | Thin specular features are undersampled | Inspect motion and tune resolution, roughness, filtering, and finishing |

**Reflect:** which weak view required a lighting change, and which required a different material or camera limit? Keep those causes separate in your saved evidence.

<div data-mark-done></div>
