---
id: product.light-form.page
elective: product
kind: page
concepts: [product.light-form]
---

# Light sources and readable form

> **Definition:** Lighting makes a product's shape and surface detail readable by controlling where light arrives, how broadly it arrives, and how much reaches the darker sides.
>
> **Used for:** Revealing leather grain, separating a black handle from its background, photographing white packaging, and lighting a configurator without changing its materials.

## Evidence

The featured watch's `strap` has roughness **0.473185**, a restored leather normal map repeated **3 × 3**, and normal scale **(0.3, −0.3)**. Its `metal` case is much smoother: roughness **0.047670**, metalness **1**. Those parts need different kinds of readability: the strap needs changes in shading across grain; the case needs useful reflections across its curves.

The GLB contains a directional light with intensity **20** in its ground setup. These study scenes disable imported lights and introduce the sources shown below. This separates cause and effect; it does not reproduce WebGi's renderer or its proprietary passes. The fitted watch is three scene units across its largest dimension; these distances are teaching units, not a claim about its physical size.

## Why it works

### Direction reveals texture; fill decides how much survives

A normal map tips the surface's lighting direction at each pixel. Light from a useful angle makes neighboring pixels respond differently. Broad, even illumination can make those differences hard to see, despite the normal map still being active. Strong frontal fill also lifts the dark side of every small fold, reducing apparent texture contrast.

**Analogy:** rake a flashlight across a textured wall, then shine it straight at the wall. The surface did not change; the differences in how it faces the light became easier or harder to read.

Move the **key direction** while leaving the normal strength alone. Change **source width and height**, then change **directional fill intensity** independently. An area light grows the reflected source as its dimensions grow. Increasing its dimensions at fixed intensity can also increase total illumination: the control is not an exposure-preserving comparison.

<div data-scene="shape"></div>

**Exercise · Reveal the strap.** Find a direction where grain is readable at normal product-viewing distance. Raise fill until the grain becomes difficult to distinguish, then recover detail by adjusting fill and direction. Save a screenshot and settings for both states. Explain which source revealed the grain and which source concealed its contrast.

**Exercise · Dark and light products.** Switch the strap to black and white dielectric tests. These deliberately replace its color and metallic blending; they are diagnostic swatches, not the original finish. Make each readable without changing exposure or normal scale. Black needs visible reflected highlights and silhouette separation; white needs retained differences between its lit and darker regions. Orbit afterward: a front-facing success can hide a failure behind.

### Distance, beam, and source size do different jobs

A directional light supplies parallel light without distance falloff. A point light radiates in all directions and falls off with distance. A spot light adds a directed cone; its `angle` is the cone's half-angle and `penumbra` softens the cone edge. It does not create the large reflected rectangle of an area light. A rectangular area light models a source with width and height, but three.js r186 gives it **no native shadows**.

Use the second scene to move a point light from distance 3 to 6. At a fixed target, with `decay = 2` and no cutoff, its distance multiplier becomes one quarter. The screen pixel need not become one quarter as bright: tone mapping, material response, and other contributions intervene. The readout reports the pre-material distance multiplier, not measured screen brightness.

<div data-scene="falloff"></div>

**Exercise · Repair a source.** Enable distance compensation and check the target again. Then set a cutoff shorter than the distance and inspect the failure: increasing intensity cannot illuminate a point outside the source's reach. Switch to a spot and widen its half-angle until the whole intended part is covered. Save one corrected configuration and name the original cause.

## The code

These are the source constructions and controls used in `scenes.ts`; the shared stage handles loading the watch and its HDR.

### Give a light a visible source size

```ts
RectAreaLightUniformsLib.init(); // LTC textures required by WebGL area lights
const key = new THREE.RectAreaLight(0xffffff, 12, 2, 2);
key.position.set(Math.sin(radians) * 4, 2.6, Math.cos(radians) * 4);
key.lookAt(target);             // area lights face their local −Z direction
key.width = width;
key.height = width;
scene.add(key);
```

### Separate distance from beam coverage

```ts
const point = new THREE.PointLight(0xffffff, 80, 0, 2);
const spot = new THREE.SpotLight(0xffffff, 80, 0, Math.PI / 4, 0.3, 2);
spot.target.position.set(0, 1.2, 0);
scene.add(point, spot, spot.target); // the target needs an updated world matrix
point.intensity = 80 * (distance / 3) ** 2; // target-only distance compensation
spot.angle = THREE.MathUtils.degToRad(beam);
```

Intensity numbers for different source types cannot be treated as a simple photographic key/fill ratio. Measure or judge their actual contribution to the same surface. More lights also cost more shader work; enabling shadows adds separate rendering work. Use the fewest sources that produce the intended readable form.

## How it goes wrong

| Symptom | Cause | Repair |
| --- | --- | --- |
| Leather has detail only at extreme zoom | Illumination flattens contrast, grain is too fine, or the screen cannot resolve it | Check direction and fill here, then texture scale and viewing resolution in their units |
| Metal gets brighter but still looks shapeless | Increased intensity preserved the same unhelpful reflection layout | Design panels in the next unit |
| An area light lights the wrong side | Its local −Z face points away | Set position, then `lookAt` the product |
| A spot's beam is clipped | Wrong target, narrow angle, or distance cutoff | Inspect target, half-angle, and cutoff separately |
| A large light casts no shadow | Native RectAreaLight does not support shadows | Add a deliberate supported shadow solution in the grounding unit |

**Acceptance:** save readable blue, black, and white strap views; retain grain at the intended zoom; explain direction, source size, fill, and falloff independently. Verify at least front, side, and rear views. Write one sentence naming a material setting you left fixed so the comparison remained useful.

<div data-mark-done></div>
