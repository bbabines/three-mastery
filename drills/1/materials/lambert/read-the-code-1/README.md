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

> **In short:** Diffuse light is the light a matte surface scatters evenly in every direction, so its brightness depends only on how squarely the surface faces the light, the dot product of its normal and the direction to the light, cut off at 0, and not on where it's seen from.
>
> **Used for:** The basic shading that makes a ball look round; low side light that shows off the texture of fabric, stone, or brushed metal; the flat bands of a cartoon look; and the matte part of every physically based material, including `MeshStandardMaterial`.

## A · The basics

### Matte surfaces scatter light every way

Light hitting a matte surface, like paper, chalk, or plaster, bounces off in every direction equally. That scattered light is called **diffuse** light. How bright a spot looks depends on one thing: how squarely it faces the light.

- Facing the light head-on: full brightness.
- Tilted away: dimmer, the more it tilts.
- Side-on to the light, or facing away: no light at all.

That's the dot product page's lighting line, `max(dot(normal, toLight), 0.0)`, where `normal` is the direction the surface faces (the vertex normals page) and `toLight` points at the light, both length 1. The `max` stops a surface facing away from getting less than no light.

**Analogy: a flashlight on a wall.** Shine it straight at the wall and you get a small, bright spot. Tilt the wall away and the same light spreads over more wall, so each part of it gets dimmer. Tilt it all the way side-on and it gets nothing.

The line on a ball where the lit side turns into the dark side, where the dot product reaches 0, is called the **terminator**. Swing the light around. The arrows at the marked spot are its normal (white) and the direction to the light (yellow).

<div data-scene="terminator"></div>

<details>
<summary>The math, if you're curious</summary>

This is **Lambert's cosine law**: brightness = surface color × light color × max(N · L, 0), where N · L, read "N dot L", is the dot product of the unit normal N and the unit direction to the light L. For unit vectors it's the cosine of the angle between them, which is where the name comes from.

</details>

### The viewer isn't in it

Notice what the formula leaves out: the camera. A matte spot scatters the same light in every direction, so it looks equally bright from anywhere. Walk around a lit ball and its lit side stays exactly where it was. Shine and reflections are different: they depend on where you look from, which the specular page covers.

Orbit the camera with the slider. The readout reads the marked spot's color straight off the screen.

<div data-scene="viewer"></div>

## B · Working knowledge

### In three.js

```js
const plaster = new MeshLambertMaterial({ color: '#d8d2c8' }); // diffuse only
```

- `MeshLambertMaterial` is diffuse and nothing else, worked out for every pixel, which makes it one of the cheapest lit materials.
- `MeshStandardMaterial` and `MeshPhongMaterial` use the same diffuse part and add shine on top. The PBR metal and roughness page shows that metals have no diffuse part at all.
- Diffuse needs normals. A mesh with missing or wrong normals shades wrong, which the vertex normals page covers.

### In a shader

```glsl
float diffuse = max(dot(normal, toLight), 0.0);
vec3 color = baseColor * (ambient + lightColor * diffuse);
```

- **Both directions length 1, and in the same space.** three.js's own shaders light in view space, measured from the camera: the normal goes through the normal matrix (the normal matrix page) and the light's direction is turned to match. A normal in one space dotted with a light direction in another gives lighting that swims as the camera moves.
- **Keep the `max`.** Without it, a surface facing away gets a negative number, which subtracts from the ambient light and turns it darker than it should be.

### Softening the terminator, and side lighting

A single light gives a hard terminator and a black dark side. Real rooms bounce light everywhere, so scenes add a fill: an `AmbientLight` or `HemisphereLight`, or an environment (the environment maps page). Too much fill flattens everything, which the light types page shows.

Light from a low angle, nearly side-on, makes small bumps and scratches stand out, because a small tilt changes how squarely each spot faces the light a lot. Product shots of fabric or brushed metal use it on purpose.

### Toon shading

```js
const bands = new DataTexture(new Uint8Array([80, 160, 255]), 3, 1, RedFormat);
bands.needsUpdate = true;
const toon = new MeshToonMaterial({ color: '#22c55e', gradientMap: bands });
```

`MeshToonMaterial` takes the same "how squarely it faces the light" number and snaps it into flat bands. The gradient map lists the bands' brightness from dark to light, and needs `NearestFilter`, which a `DataTexture` has by default; a texture from `TextureLoader` blends its pixels together and the bands blur.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
