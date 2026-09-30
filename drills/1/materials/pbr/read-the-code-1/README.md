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

> **In short:** Two numbers describe most real surfaces: metalness says whether it's a metal, and roughness says how blurry its reflections are.
>
> **Used for:** Telling steel, powder coat, and rubber apart, chrome trim, every glTF model, and brushed finishes.

## A · The basics

### Two numbers for every real material

A **physically based** material sets both a surface's diffuse color and its shine from two numbers, so the balance between them stays the way it is in the real world:

- **`metalness`**: 0 for a non-metal, 1 for a metal. A non-metal, like paint, plastic, or rubber, shows its own color with a faint, colorless reflection on top. A metal has no diffuse color: everything you see is reflection, tinted by the metal's color, which is why gold reflects gold.
- **`roughness`**: 0 for mirror-smooth, 1 for fully matte. Smooth surfaces give sharp reflections and tight highlights; rough ones spread them into a soft sheen.

**Analogy: a mug and a spoon.** A glazed mug has its own color with a clear shine on top. A polished spoon has no color of its own; you see the room in it, tinted silver, and sandblasting it blurs the room into a soft glow.

Try both sliders on the ball, lit by a studio room it can reflect.

<div data-scene="sliders"></div>

<details>
<summary>The math, if you're curious</summary>

How strongly a surface reflects when you look at it head-on is called **F0**: about 4% and colorless for a non-metal, and the base color for a metal. three.js works it out as F0 = mix(0.04, color, metalness).

</details>

### Metalness is a switch, not a dial

Real surfaces are either metal or not, so metalness is almost always 0 or 1. In-between values are for the texture pixels where metal meets something else, like the edge of chipped paint, so the two blend smoothly. A whole surface at 0.5 matches no real material and tends to look milky and plasticky. Compare the finishes.

<div data-scene="finishes"></div>

## B · Working knowledge

### Setting up a finish

```js
const steel = new MeshStandardMaterial({ color: '#c0c4c8', metalness: 1, roughness: 0.35 });
const powderCoat = new MeshStandardMaterial({ color: '#1e3a8a', metalness: 0, roughness: 0.55 });
const rubber = new MeshStandardMaterial({ color: '#26282c', roughness: 0.95 });
```

The defaults are `metalness: 0` and `roughness: 1`, a fully matte non-metal, so a gray "steel" that forgets `metalness: 1` looks like gray paint. A metal's color is its reflection color, and real metals reflect a lot of light, so their colors are usually light.

### Metals need something to reflect

With only ordinary lights, a metal shows its highlights and little else, and an `AmbientLight` adds nothing to it, since ambient light feeds only the diffuse part. Give it `scene.environment`, which the environment maps page covers.

### Maps

```js
material.roughnessMap = roughnessTexture; // multiplied by material.roughness
material.metalnessMap = metalnessTexture; // multiplied by material.metalness
```

A map varies the number across the surface, like scuffs on a smooth panel or bare metal where paint has worn off. Each map is multiplied by its number, so with a `metalnessMap`, set `metalness: 1`, or the default 0 wipes the map out.

### Brushed metal and car paint

`MeshPhysicalMaterial` adds layers on top: `anisotropy` stretches highlights along the brushing of brushed metal, and `clearcoat` puts a glossy clear layer over a base coat, like car paint.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
