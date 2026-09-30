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

> **In short:** Each light is an object in the scene, and the kinds differ in where their light comes from.
>
> **Used for:** Studio shots of a product, softboxes and windows, ceiling lamps in a room, and sunlight outdoors.

## A · The basics

### Every light is an object in the scene

A light is an Object3D like any other: you `scene.add` it, and it moves with `position` or rides along with a parent. Only lit materials react to it. Each light has a `color` and an `intensity`, and the kinds differ in where the light comes from.

**Analogy: a photo studio.** Bounce light fills in every shadow a little, the sun through a skylight shines in parallel, a bare bulb shines every way from one spot, and a softbox is a big glowing panel. three.js has a light for each.

### The members, at a glance

| Light | What it is | Pick it for | Cost |
| --- | --- | --- | --- |
| `AmbientLight` | The same light on every surface, from every side | Lifting the darkest shadows a little | The least; no shadows |
| `HemisphereLight` | Sky color from above, ground color from below | Cheap, natural-looking fill | Very low; no shadows |
| `DirectionalLight` | Parallel light from far away, like the sun | The main light outdoors, or a studio's key light | Low per pixel; a shadow adds one render |
| `PointLight` | Light every way from one spot, like a bare bulb | Lamps, glowing parts | Per pixel, per light; a shadow adds six renders |
| `SpotLight` | A cone of light from one spot | Stage lights, flashlights, a highlight on a product | Per pixel, per light; a shadow adds one render |
| `RectAreaLight` | A glowing rectangle, like a softbox or a window | Soft studio light | More per pixel than the others; Standard and Physical only; no shadows |

The light types and falloff page covers how light fades with distance, and the shadows page covers shadows.

Try each light on the two balls: Standard on the left, Lambert on the right.

<div data-scene="members"></div>

## B · Working knowledge

### Fill and sun: hemisphere and directional

```js
scene.add(new HemisphereLight(0xdde8ff, 0x3a2f28, 1.5)); // sky color, ground color, intensity
const sun = new DirectionalLight(0xffffff, 3);
sun.position.set(3, 5, 2);
scene.add(sun, sun.target); // it shines from position toward target
```

Ambient and hemisphere light reach every surface with no direction to speak of, so they can't make shading or shadows on their own. A directional light shines from its `position` toward its `target`, and `rotation` does nothing. The target has to be in the scene, or it stays at the origin.

### Bulbs and cones: point and spot

```js
const bulb = new PointLight(0xffc98a, 20);
const spot = new SpotLight(0xffffff, 40, 0, Math.PI / 6, 0.3); // color, intensity, distance, angle, penumbra
scene.add(bulb, spot, spot.target);
```

Both fade with distance. `angle` is half the cone's width, in radians, and `penumbra`, from 0 to 1, softens its edge.

### Softboxes and windows: RectAreaLight

```js
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init(); // once, before the first render
const softbox = new RectAreaLight(0xffffff, 8, 2, 1); // color, intensity, width, height
softbox.lookAt(0, 1, 0); // it shines out of its front
```

Without `init()` there's no error, but the shine on glossy surfaces is missing, so a metal stays black. It lights only `MeshStandardMaterial` and `MeshPhysicalMaterial`, and it casts no shadows; a Lambert or Phong material under it stays dark.

### Numbers from old tutorials

Light intensities are physically based: a point or spot light's `intensity` is in candela, the unit for how bright a light source is. Old tutorials were written for a lighting mode three.js has since removed, so their numbers don't carry over, and a leftover `renderer.useLegacyLights = true` does nothing. Tune intensities by eye, in your own scene.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
