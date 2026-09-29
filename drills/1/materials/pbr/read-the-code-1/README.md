---
id: 1.materials.pbr.read-the-code.1
loop: 1
tier: core
concepts: [materials.pbr]
mode: read-the-code
context: materials.pbr/steel-coat-rubber
lenses: []
misconceptions:
  - materials.pbr/half-metal
---

# PBR metal and roughness

> **In short:** Physically based rendering (PBR) describes a surface with two numbers that follow how real materials behave: metalness says whether it's a metal, which has no diffuse color and tints its reflections, or a non-metal, which has its own diffuse color under faint, untinted reflections; roughness says how sharp or blurry the reflections and highlights are.
>
> **Used for:** Telling bare steel, powder coat, and rubber apart on the same product; chrome trim and polished fittings; the look of every glTF model, whose materials are stored as metalness and roughness; and finishes that stay believable under any lighting, from a studio to a sunny street.

## A · The basics

### Two numbers for every real material

The diffuse page covered the color a surface scatters, and the specular page its shine. A **physically based** material sets both from two numbers, so the balance between them stays the way it is in the real world:

- **`metalness`**: 0 for a non-metal, 1 for a metal. A non-metal (paint, plastic, wood, rubber, fabric) shows its own color, plus a faint, colorless reflection on top. A metal (steel, aluminum, gold, chrome) has no diffuse color at all: everything you see is reflection, tinted by the metal's color. That's why gold reflects gold.
- **`roughness`**: 0 for mirror-smooth, 1 for fully matte. Smooth surfaces give sharp reflections and tight highlights; rough ones spread them into a soft sheen. It's the physically based version of the specular page's `shininess`, turned around.

**Analogy: a mug and a spoon.** A glazed mug has its own color with a clear shine on top: a non-metal. A polished spoon has no color of its own; you see the room in it, tinted silver: a metal. Sandblast the spoon and it's the same metal, just rough, so the room blurs into a soft glow.

Try both sliders on the ball, lit by a studio room it can reflect.

<div data-scene="sliders"></div>

<details>
<summary>The math, if you're curious</summary>

Metalness blends between two recipes. How strongly a surface reflects when you look at it head-on is called **F0**. For non-metals it's about 4% and colorless; for metals it's the base color. three.js works it out as F0 = mix(0.04, color, metalness), and scales the diffuse color by (1 − metalness). The reflection itself comes from a **microfacet BRDF** (the GGX model), which pictures the surface as tiny mirrors tilted more and more randomly as roughness goes up.

</details>

### Metalness is a switch, not a dial

Real surfaces are either metal or not, so metalness is almost always 0 or 1. Values in between are for the pixels of a texture where metal meets something else, like the edge of chipped paint or a patch of rust, so the two blend smoothly. A whole surface at 0.5 isn't a "semi-metal": it's a mix of the two recipes that doesn't match any real material, and it tends to look milky and plasticky, with washed-out reflections. Compare the finishes.

<div data-scene="finishes"></div>

## B · Working knowledge

### Setting up a finish

```js
const steel = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 1, roughness: 0.35 });
const powderCoat = new MeshStandardMaterial({ color: '#1e3a8a', metalness: 0, roughness: 0.55 });
const rubber = new MeshStandardMaterial({ color: '#26282c', roughness: 0.95 });
```

- **The defaults are `metalness: 0` and `roughness: 1`,** so a new `MeshStandardMaterial` is a fully matte non-metal, whatever its color. A gray "steel" that forgets `metalness: 1` looks like gray paint.
- **A metal's color is its reflection color,** and real metals reflect a lot of light, so as a rule of thumb their colors are light: steel is a light gray, not a dark one.
- **Metals need something to reflect.** With no environment and only ordinary lights, a metal shows its highlights and little else, and an `AmbientLight` adds nothing to it. The environment maps page covers `scene.environment`.

### Maps

```js
material.roughnessMap = roughnessTexture; // multiplied by material.roughness
material.metalnessMap = metalnessTexture; // multiplied by material.metalness
```

A map varies the number across the surface: rough scuffs on a smooth panel, bare metal where paint has worn off. Each map is multiplied by its number, so with a `metalnessMap`, set `metalness: 1`, or the default 0 wipes the map out. The channel packing page shows how glTF stores both maps in one texture; GLTFLoader sets all of this up for you.

### Beyond the two numbers

- **Brushed metal** stretches its highlights along the brushing. `MeshPhysicalMaterial`'s `anisotropy` (0 to 1) and `anisotropyRotation` do that.
- **Car paint** is a base coat under a glossy clear layer: `MeshPhysicalMaterial`'s `clearcoat` and `clearcoatRoughness`.
- Each of these extras adds shader work only while it's above 0, as the materials tour covers.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
