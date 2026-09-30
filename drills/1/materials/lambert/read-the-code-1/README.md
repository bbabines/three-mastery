---
id: 1.materials.lambert.read-the-code.1
loop: 1
tier: core
concepts: [materials.lambert]
mode: read-the-code
context: materials.lambert/terminator
lenses: []
misconceptions:
  - materials.lambert/depends-on-viewer
---

# Diffuse (Lambert)

> **In short:** A matte surface is brighter the more squarely it faces the light, and looks the same from wherever you view it.
>
> **Used for:** Round-looking shading, side light on fabric and stone, cartoon bands, and the matte part of every PBR material.

## A · The basics

### Matte surfaces scatter light every way

Light hitting a matte surface, like paper or plaster, bounces off in every direction equally. That scattered light is called **diffuse** light, and how bright a spot looks depends only on how squarely it faces the light: full brightness head-on, dimmer as it tilts away, and none at all side-on or facing away.

That's the dot product page's lighting line, `max(dot(normal, toLight), 0.0)`, where `normal` is the direction the surface faces and `toLight` points at the light, both length 1.

**Analogy: a flashlight on a wall.** Shine it straight at the wall and you get a small, bright spot. Tilt the wall away and the same light spreads over more wall, so each part of it gets dimmer.

The line on a ball where the lit side turns dark is called the **terminator**. Swing the light around and watch the red ring, then try Toon.

<div data-scene="terminator"></div>

<details>
<summary>The math, if you're curious</summary>

This is **Lambert's cosine law**: brightness = surface color × light color × max(N · L, 0), where N · L is the dot product of the normal and the direction to the light. For length-1 directions it's the cosine of the angle between them.

</details>

### The viewer isn't in it

The camera appears nowhere in that line. A matte spot scatters the same light in every direction, so it looks equally bright from anywhere: walk around a lit ball and its lit side stays exactly where it was. Shine is different, since it depends on where you look from, which the specular page covers.

Orbit the camera with the slider and watch the color inside the red ring.

<div data-scene="viewer"></div>

## B · Working knowledge

### In three.js

```js
const plaster = new MeshLambertMaterial({ color: '#d8d2c8' }); // diffuse only
```

`MeshLambertMaterial` is diffuse and nothing else, which makes it one of the cheapest lit materials. `MeshStandardMaterial` and `MeshPhongMaterial` use the same diffuse part and add shine on top. Diffuse needs normals, so a mesh with wrong normals shades wrong.

### In a shader

```glsl
float diffuse = max(dot(normal, toLight), 0.0);
vec3 color = baseColor * (ambient + lightColor * diffuse);
```

Both directions need length 1 and the same space; three.js's own shaders light in view space, measured from the camera. A normal in one space dotted with a light direction in another gives lighting that swims as the camera moves. Keep the `max`, or a surface facing away subtracts from the ambient light.

### Fill and side light

A single light gives a hard terminator and a black dark side, so scenes add fill: an `AmbientLight`, a `HemisphereLight`, or an environment. Light from a low angle, nearly side-on, makes small bumps and scratches stand out, since a small tilt then changes a spot's brightness a lot.

### Toon shading

```js
const bands = new DataTexture(new Uint8Array([80, 160, 255]), 3, 1, RedFormat);
bands.needsUpdate = true;
const toon = new MeshToonMaterial({ color: '#22c55e', gradientMap: bands });
```

`MeshToonMaterial` snaps the same number into flat bands, listed dark to light in the gradient map. The map needs `NearestFilter`, which a `DataTexture` has by default; one from `TextureLoader` blends its pixels, and the bands blur.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
