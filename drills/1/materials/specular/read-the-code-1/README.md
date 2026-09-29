---
id: 1.materials.specular.read-the-code.1
loop: 1
tier: light
concepts: [materials.specular]
mode: read-the-code
context: materials.specular/moving-highlights
lenses: []
misconceptions:
  - materials.specular/highlights-stay
---

# Specular and half vector

> **In short:** Specular light is the mirror-like part of a surface's light, the highlight, and it's brightest where the surface's normal lines up with the half vector, the direction halfway between the directions to the light and to the viewer, so a highlight moves when the viewer moves.
>
> **Used for:** Telling glossy plastic from matte rubber at a glance; the glint that slides across a car or a phone as a product turns; understanding what the roughness slider on every PBR material does; and the sparkle on water, glass, and polished metal.

## A · The basics

### Shine is a blurry mirror

The diffuse page covered the light a surface scatters evenly. A glossy surface also reflects some light like a mirror, toward one direction. Where that reflection points into your eye, you see a bright spot: the **highlight**, or **specular** light.

Whether a spot sends its reflection into your eye depends on three directions at that spot: the normal, the direction to the light, and the direction to the viewer. The shortcut three.js uses is the **half vector**, the direction exactly halfway between "to the light" and "to the viewer". The highlight is brightest where the normal lines up with the half vector. Move the camera and the half vector changes, so the highlight moves.

**Analogy: the sun glinting on a lake.** Walk along the shore and the glint follows you across the water. The water's color stays put; only the glint moves.

Orbit the camera with the slider. At the highlight, the yellow arrow points to the light, the blue one to the camera, and the green one is the half vector, which the normal there matches. Then change how tight the highlight is.

<div data-scene="glint"></div>

## B · Working knowledge

### In three.js

```js
const plastic = new MeshPhongMaterial({ color: '#1e3a8a', shininess: 80, specular: 0x333333 });
```

- `shininess` (default 30) sets how tight the highlight is: higher is smaller and sharper, like polished plastic; lower is broad and soft. `specular` is the highlight's color and strength (default a dark gray, `0x111111`).
- `MeshStandardMaterial` has no `shininess`. Its `roughness` does the same job the physically based way: low roughness, tight highlights. The PBR metal and roughness page covers it.
- A highlight is painted by the light, so it's only as right as the normals. Faceted normals give faceted highlights.

### In a shader

```glsl
vec3 halfVector = normalize(toLight + toViewer);
float shine = pow(max(dot(normal, halfVector), 0.0), shininess);
```

- **Normalize the half vector.** Adding two length-1 directions gives something up to 2 long, and the dot product with it can go past 1, which `pow` blows up into a glaring highlight.
- **`toViewer` runs from the surface point to the camera**, so it's different at every point. The direction the camera faces is a different thing. (With an orthographic camera it is the same everywhere, and three.js uses one direction.)

### Highlights in textures

A highlight painted into a color texture, or baked into a lightmap (the baked lighting page), stays put as the camera moves, and looks fake the moment the product turns. Leave highlights to the lights and the environment.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
