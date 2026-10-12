---
id: product.shadows-grounding.page
elective: product
kind: page
concepts: [product.shadows-grounding]
---

# Shadows and grounding

> **Definition:** Grounding combines contact, cast shadows, and consistent placement so a product looks supported by a surface rather than floating over it.
>
> **Used for:** Catalog turntables, watches on a tabletop, adjustable fitness equipment, and configurators whose dimensions or parts can move.

## Evidence

On the live WebGi site, three things ground the watch:

- **A contact shadow.** WebGi's ground (its ContactShadowGroundPlugin) is a white, reflective floor (roughness **0.25**, metalness **0.782**, not tone mapped). It takes a depth picture of the watch from under the floor, blurs it, and darkens the floor where the watch is close.
- **The key light's shadow.** The GLB's `light_0` casts the soft shadow behind and to the right of the watch, through an ordinary shadow map softened by PCF (radius about **1.07**).
- **Ambient occlusion** (SSAO) at **0.25**, which darkens creases on the watch itself.

The ground settings saved inside the GLB (a randomized light baked over up to 400 frames) come from an older WebGi and aren't what the live site renders. Loading the GLB into three.js brings none of these along. The shared stage rebuilds all three with native parts (`ground.ts`, the GLB's light, and the finishing chain) and shows them by default.

These labs turn all three off and use one ordinary directional shadow map and a plain plane receiver, so the shadow you're adjusting is the only one. The watch is fitted to sit at height zero, and the plane is just below it. Glass is excluded from casting an opaque silhouette. The renderer still does not simulate physically correct transparent shadowing through the watch glass.

## Why it works

### A shadow map is another camera's depth picture

The light renders depth from its viewpoint. A product surface is shaded as shadowed when a nearer surface blocks it in that depth picture. This makes the light's camera coverage, near/far range, and map resolution part of the visible result.

**Analogy:** take a silhouette photograph from the lamp's position and project its obstruction back onto the scene. A small photograph stretched over a huge floor cannot retain fine detail; a tightly cropped photograph can omit part of the product.

The first scene lets you inspect the shadow camera. Its **frustum half-width** controls both horizontal and vertical coverage. Doubling full width at the same pixel count doubles world-space texel width. Increasing resolution helps detail but raises memory and rendering cost. A directional light needs one shadow view; a point light's omnidirectional shadow requires six views, so its cost needs separate consideration.

<div data-scene="clinic"></div>

**Exercise · Diagnose coverage and resolution.** Compare resolution 256 against 1024 with the frustum fixed. Then widen the frustum with resolution fixed. Identify the jagged edge or detail loss each change produces. Shrink coverage until part of the watch's cast shadow is omitted; reveal the camera to explain the missing region. Restore useful coverage before choosing the lowest acceptable resolution. Export settings and a close-up.

**Exercise · Repair contact.** Raise depth bias and normal bias separately, then inspect self-shadow and where the strap meets the plane. Large bias can separate shadow from its caster or erase detail. Too little bias can produce speckles or stripes from self-shadow precision. Recover contact with the smallest settings that avoid the visible artifact. This is a diagnosis task, not a universal pair of magic numbers: object size, camera range, and lighting direction change the required values.

### Frozen shadows describe an earlier scene

A cached shadow is useful when the geometry and light remain unchanged. It becomes wrong when a watch moves, a strap changes shape, a product lifts, or a light changes direction. Camera orbit alone need not invalidate an ordinary light-space shadow map: the shadow camera describes the light's view, not the customer's view.

Freeze the map at the current placement, then move the watch. The shadow stays where the captured geometry was. Refresh the map and it catches up. A lift should change shadow placement and contact naturally; a shadow pasted under the object can conceal that height change.

<div data-scene="stale"></div>

**Exercise · Define invalidation.** Freeze the current placement; change horizontal offset and height; capture the wrong result; refresh and capture the corrected result. Write which configurator actions must invalidate the cached shadow: geometry, transforms, light settings, and any receiver changes that affect a chosen bake. State why orbiting the camera is different. This scene freezes a native depth map; it isn't a baked shadow.

## The code

The native shadow rig is `shadowRig` in this unit's `scenes.ts`.

### Configure a light and receiver

```ts
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 14;
sun.shadow.bias = -0.0001;
sun.shadow.normalBias = 0.01;
floor.receiveShadow = true;
```

The watch meshes also need `castShadow`. `receiveShadow` determines whether a material receives supported light shadows; it does not make a mesh cast one. The plane is an ordinary rough material so both illumination and obstruction are visible. A `ShadowMaterial` is another option for compositing shadows onto a separate background.

### Change camera coverage correctly

```ts
Object.assign(sun.shadow.camera, {
  left: -width, right: width, top: width, bottom: -width,
});
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.needsUpdate = true;
```

When changing map dimensions, the scene disposes the old render target and clears `sun.shadow.map`, so a correctly sized target is allocated. PCF filters a finite shadow map; it is not physical penumbra calculation from a broad area source. The source-size lesson therefore does not promise that an area's dimensions control this directional shadow's softness.

### Freeze and refresh explicitly

```ts
sun.shadow.needsUpdate = true;
renderer.render(scene, camera); // capture current placement first
sun.shadow.autoUpdate = false;
// After a product configuration changes:
sun.shadow.needsUpdate = true;
```

## How it goes wrong

| Symptom | Cause | Repair |
| --- | --- | --- |
| Product floats despite sitting on the plane | Excess bias or an unrelated painted shadow | Restore contact and validate the actual placement |
| Shadow abruptly stops | Light camera omitted the caster or receiver | Inspect its frustum and depth range |
| Small details turn into blocks | Too few texels across the relevant area | Tighten coverage, then raise resolution if needed |
| Watch moves but shadow stays | Cached depth or baked data was not invalidated | Refresh after the relevant configurator changes |
| Black halo is used as “bounce light” | Occlusion was mistaken for indirect illumination | Treat AO and indirect light separately in the next unit |
| Glass casts a solid black disk | Opaque shadow casting ignores its transmission | Use a deliberate transmission-aware solution or documented approximation |

**Acceptance:** inspect close-up contact, retain full camera coverage, distinguish bias from resolution errors, and demonstrate a stale shadow repaired after movement. Save the lowest acceptable quality settings and state their visible compromise.

<div data-mark-done></div>
