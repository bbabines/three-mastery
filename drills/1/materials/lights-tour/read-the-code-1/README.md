---
id: 1.materials.lights-tour.read-the-code.1
loop: 1
tier: light
concepts: [materials.lights-tour]
mode: read-the-code
context: materials.lights-tour/studio-product
lenses: []
misconceptions:
  - materials.lights-tour/rectarea-any-material
  - materials.lights-tour/old-intensities
---

# Tour: lights

> **In short:** Lights are objects in the scene that lit materials read: ambient and hemisphere light fill in evenly, a directional light shines in parallel like the sun, point and spot lights shine from one spot, and a RectAreaLight shines from a glowing rectangle.
>
> **Used for:** A studio setup that makes a product look its best; the soft glow of a window or a photographer's softbox; ceiling lamps in a room or a warehouse aisle; and the sun over an outdoor scene.

## A · The basics

### Every light is an object in the scene

A light is an Object3D like any other (the Object3D API tour): you `scene.add` it, and it moves with `position`, or rides along with a parent. Only lit materials react to it; the materials tour showed which ones those are. Each light has a `color` and an `intensity`, and the kinds differ in where the light comes from.

**Analogy: a photo studio.** The room's bounce light fills in every shadow a little. The sun through a skylight shines in parallel from one direction. A bare bulb shines every way from one spot, a stage spot throws a cone, and a softbox is a big glowing panel. three.js has one light for each.

### The members, at a glance

| Light | What it is | Reach for it when | Cost |
| --- | --- | --- | --- |
| `AmbientLight` | The same light on every surface, from every side | Lifting the darkest shadows a little | The least; no shadows |
| `HemisphereLight` | Sky color from above, ground color from below | Cheap, natural-looking fill | Very low; no shadows |
| `DirectionalLight` | Parallel light from far away, like the sun | The main light outdoors, or a studio's key light | Low per pixel; a shadow adds one render |
| `PointLight` | Light every way from one spot, like a bare bulb | Lamps, glowing parts | Per pixel, per light; a shadow adds six renders |
| `SpotLight` | A cone of light from one spot | Stage lights, flashlights, a highlight on a product | Per pixel, per light; a shadow adds one render |
| `RectAreaLight` | A glowing rectangle, like a softbox or a window | Soft studio light | More per pixel than the others; lights only Standard and Physical; no shadows |

This page only maps them out. The light types and falloff page, later in this domain, covers how light fades with distance and why scene units matter, and the shadows page covers shadows.

Try each light on the two balls. The left one is `MeshStandardMaterial`, the right one `MeshLambertMaterial`, and the scene's other lights are off. The readout shows the line that made the light and its setup quirk.

<div data-scene="members"></div>

## B · Working knowledge

### Fill: ambient and hemisphere

```js
scene.add(new AmbientLight(0xffffff, 0.4));
scene.add(new HemisphereLight(0xdde8ff, 0x3a2f28, 1.5)); // sky color, ground color, intensity
```

Both light every surface with no direction to speak of, so they can't make shading or shadows on their own. Too much of either washes the shading out; the light types page shows it.

### The sun: DirectionalLight

```js
const sun = new DirectionalLight(0xffffff, 3);
sun.position.set(3, 5, 2);
sun.target.position.set(0, 1, 0); // the light shines from position toward target
scene.add(sun, sun.target);
```

- **Its direction comes from `position` and `target`.** `rotation` does nothing.
- **The target has to be in the scene** for moving it to count. A target that was never added stays at the origin.

### Bulbs and cones: PointLight and SpotLight

```js
const bulb = new PointLight(0xffc98a, 20);
const spot = new SpotLight(0xffffff, 40, 0, Math.PI / 6, 0.3); // color, intensity, distance, angle, penumbra
spot.position.set(0, 4, 2);
scene.add(bulb, spot, spot.target);
```

Both fade with distance. `angle` is half the cone's width, in radians, and `penumbra` (0 to 1) softens its edge. A SpotLight aims at its `target`, like a DirectionalLight.

### Softboxes and windows: RectAreaLight

```js
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init(); // once, before the first render
const softbox = new RectAreaLight(0xffffff, 8, 2, 1); // color, intensity, width, height
softbox.position.set(0, 2, 2);
softbox.lookAt(0, 1, 0); // it shines out of its front, toward where it looks
```

- **`init()` loads the lookup tables for its shine.** Without it there's no error: matte surfaces still get the light, but the shine on glossy ones is missing, and a metal, which has only shine, stays black.
- **It lights only `MeshStandardMaterial` and `MeshPhysicalMaterial`.** A Lambert, Phong, or Toon material under it stays dark, with no error.
- **It casts no shadows.** It has no `shadow` at all, so `castShadow = true` changes nothing.
- `RectAreaLightHelper`, from `three/addons/helpers/RectAreaLightHelper.js`, draws the rectangle so you can see where it is.

### Numbers from old tutorials

Light intensities are physically based: a point or spot light's `intensity` is in candela, the unit for how bright a light source is. Old tutorials were written for an older lighting mode that three.js has since removed, so their numbers don't carry over, and a leftover line like `renderer.useLegacyLights = true` does nothing in r186. Tune intensities by eye, in your own scene.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
