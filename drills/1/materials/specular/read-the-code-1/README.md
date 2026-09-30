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

> **In short:** A highlight is the mirror-like glint on a shiny surface, and it moves whenever the viewer moves.
>
> **Used for:** Glossy vs matte finishes, the glint on a turning product, the roughness slider, and sparkle on water.

## A · The basics

### Shine is a blurry mirror

The diffuse page covered the light a surface scatters evenly. A glossy surface also reflects some light like a mirror, toward one direction. Where that reflection points into your eye, you see a bright spot: the **highlight**, or **specular** light.

Whether a spot sends its reflection into your eye depends on its normal, the direction to the light, and the direction to the viewer. three.js's shortcut is the **half vector**, the direction halfway between "to the light" and "to the viewer". The highlight is brightest where the normal lines up with it, so moving the camera moves the highlight.

**Analogy: the sun glinting on a lake.** Walk along the shore and the glint follows you across the water. The water's color stays put; only the glint moves.

Orbit the camera with the slider and watch the highlight follow; the green arrow is the half vector. Then change how tight the highlight is.

<div data-scene="glint"></div>

## B · Working knowledge

### In three.js

```js
const plastic = new MeshPhongMaterial({ color: '#1e3a8a', shininess: 80, specular: 0x333333 });
```

`shininess`, 30 by default, sets how tight the highlight is: higher gives a smaller, sharper spot, like polished plastic. `specular` is the highlight's color and strength. `MeshStandardMaterial` has no `shininess`; a low `roughness` does the same job there. A highlight is only as right as the normals, so faceted normals give faceted highlights.

### In a shader

```glsl
vec3 halfVector = normalize(toLight + toViewer);
float shine = pow(max(dot(normal, halfVector), 0.0), shininess);
```

Normalize the half vector: two length-1 directions add up to something up to 2 long, and `pow` blows the result into a glaring highlight. `toViewer` runs from each surface point to the camera, so it's different at every point; it isn't the direction the camera faces.

### Highlights in textures

A highlight painted into a color texture, or baked into a lightmap, stays put as the camera moves, and looks fake the moment the product turns. Leave highlights to the lights and the environment.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
