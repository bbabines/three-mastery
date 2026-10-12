---
id: product.indirect-context.page
elective: product
kind: page
concepts: [product.indirect-context]
---

# Indirect light and scene context

> **Definition:** Indirect light is illumination that arrives after interacting with the surroundings; a real-time viewer usually represents it with an environment, stored lighting, or an explicit approximation.
>
> **Used for:** Leather in a softly lit studio, products inside rooms, warm wall bounce, AR placement, and keeping dark details visible without flattening the entire object.

## Evidence

On the live WebGi site, the watch's indirect light comes from its studio HDR at intensity **1**, with screen-space ambient occlusion (SSAO) at **0.25** darkening creases. The GLB's materials also store WebGi lightmap settings, but a stored `lightMapIntensity: 1` alone is not evidence of a baked lightmap texture, and these extensions name none. The source leather normal texture supplies surface directions; it is not a record of bounced illumination.

The labs show what native three.js actually does. Both turn off the stage's reference key light, ground, and finishing chain (its ambient occlusion would darken direct light too), and keep the studio fixed in the world instead of following the camera. The first deliberately changes the strap to **metalness 0** so diffuse contributions can be inspected on leather. Its AO and lightmap are **synthetic UV teaching fields**, not lighting baked from this watch. The light probe's coefficients are authored, not measured from a room. Each readout keeps these distinctions visible.

## Why it works

### Added illumination and removed illumination are different

A warm wall in a physical room can reflect warm light onto a product. Ordinary three.js raster rendering does not compute that bounce just because a colored wall mesh exists. An environment map can supply surrounding light, a lightmap can store a calculated lighting result, a diffuse light probe can encode broad directional irradiance, or a carefully placed fill light can approximate a specific contribution.

AO describes occlusion: it reduces selected indirect contributions where surrounding geometry would block incoming light. AO does not supply the missing light and cannot turn a direct-only scene into one with believable bounce.

**Analogy:** indirect light is money entering an account; occlusion is a deduction. Adding deductions to an empty account does not produce income.

Compare the contributions while the direct source stays on. The synthetic AO stripe should not darken the direct source in **AO without indirect light**. Compare **direct + environment** against **AO removes indirect light**: both keep the uniform environment at intensity **0.7**, and only the second adds AO. That controlled pair isolates the stripe's reduction of indirect response. **Authored warm fill** adds a directional light. **Authored diffuse probe** adds broad diffuse illumination; it does not create sharp metallic reflection bands or a cast shadow. **Synthetic UV lightmap** adds a warm irradiance gradient attached to the strap's UVs.

<div data-scene="contributions"></div>

**Exercise · Identify the contribution.** Save direct-only, warm-fill, diffuse-probe, environment-only, and AO-with-environment views. Compare the last two without moving the camera: environment intensity, direct light, and material remain fixed while AO changes. Explain which choice adds light, which removes a contribution, and which supplies specular reflections. Confirm that AO with no indirect source has no useful direct-shadow effect. Restore the reference strap in another unit afterward; this lab's dielectric change is intentional diagnosis, not a source-asset edit.

**Exercise · Expose stored-data limits.** Select the synthetic lightmap, then move the watch. Its warm gradient follows UVs instead of being recalculated from the room. Explain why an actual bake encoding proximity to a wall would become incorrect after that move. On a production asset, check the lightmap's UV channel, unique unwrap, color-space contract, and invalidation rules. A tiled detail UV is usually unsuitable for storing unique scene lighting.

### Context gives sources a reason to exist

A daylight window and a warm practical lamp suggest different source positions and colors. Mixed colors can be useful, but a warm edge with no plausible source can make a product feel composited. Establish the source's reason, then check whether it improves the actual product views.

The second scene places a warm colored wall behind the watch. Hiding that wall changes the background and visibility but does not recalculate indirect light or reflections. Enabling **Authored warm fill** approximates bounce explicitly. It remains independent of the wall's visibility on purpose: turning the wall off exposes the fill's manual nature. The HDR reflection rig remains fixed rather than being silently replaced by a room capture.

<div data-scene="context"></div>

**Exercise · Make daylight and night readable.** Compare the daylight window with the night practical. Enable authored warm fill only as needed to reveal a dark part. Orbit and identify which direct source or HDR region explains each strong highlight. Hide the colored wall and observe that its presence was not automatically generating GI. Save the daylight and night settings, and state which approximation would need revision if the product moved into another room.

**Exercise · Inspect atmosphere.** Switch fog on and off, then change camera distance. Fog attenuates according to distance; it does not reveal a volumetric beam from the practical. For close catalog work, reject it if it obscures grain or changes the finish's apparent color. For a room scene, retain it only if it serves depth and matches the scene context.

## The code

### Supply a diffuse probe explicitly

```ts
const probe = new THREE.LightProbe();
probe.sh.coefficients[0].set(0.7, 0.5, 0.3); // authored constant warm field
probe.intensity = 1;
scene.add(probe);
```

A probe stores light as spherical harmonics: nine numbers (per color) describing broad brightness by direction. Coefficient zero is the part that's the same from every direction; the rest stay zero here. These values teach the actual probe API, not a calibrated irradiance measurement. Production probes can be generated from a cube map or render target using `LightProbeGenerator`. An environment's diffuse contribution and a probe derived from the same field can double-count light if both remain fully enabled.

### Keep stored fields separate

```ts
lab.strap.aoMap = ao;
lab.strap.aoMapIntensity = 1;
lab.strap.lightMap = light;
lab.strap.lightMapIntensity = 1;
lab.strap.needsUpdate = true; // map presence changes shader configuration
```

The scene turns these on independently. Both synthetic float textures explicitly use `channel = 0` for the watch's existing detail UVs and `NoColorSpace` for linear data. This is a demonstrator; production lightmaps often use a separate unique UV channel. An AO texture is scalar data. A colored lightmap must match the producer's linear/sRGB encoding contract. The shader adds lightmap irradiance and attenuates indirect response with AO; it does not trace the surrounding room.

### Make an atmospheric choice visible

```ts
scene.fog = new THREE.Fog(0xe1d6cc, 4, 14);
material.fog = true;
material.needsUpdate = true;
```

Some reference watch materials store `fog: false`; the context lab explicitly enables it so the comparison is meaningful. Fog is a distance-based rendering treatment, not physical light scattering from these sources.

## How it goes wrong

| Symptom | Cause | Repair |
| --- | --- | --- |
| Extra AO makes a dead scene darker | Occlusion was substituted for missing light | Supply an appropriate environment, bake, probe, or controlled fill |
| Warm wall has no effect on the product | Meshes do not automatically generate bounce or environment reflections | Bake/capture an appropriate result or label the authored approximation |
| Lightmapped part stays lit after moving away from the source | Stored UV lighting describes an earlier arrangement | Rebuild or switch to a method suited to dynamic motion |
| Lighting appears twice as strong | Probe and environment represent the same contribution | Disable duplicate diffuse illumination or calibrate their intended split |
| Fog affects only some parts | Reference materials opted out | Inspect each material's `fog` flag and shader configuration |

**Acceptance:** distinguish AO, direct fill, environment, lightmap, and diffuse probe; demonstrate stored lighting remaining attached after movement; save motivated daylight/night views; reject any treatment that hides tactile detail. Record the approximations you used and the scene changes that would invalidate them.

<div data-mark-done></div>
