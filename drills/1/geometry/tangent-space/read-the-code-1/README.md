---
id: 1.geometry.tangent-space.read-the-code.1
loop: 1
tier: core
concepts: [geometry.tangent-space]
mode: read-the-code
context: geometry.tangent-space/low-poly-detail
lenses: []
misconceptions:
  - geometry.tangent-space/world-directions
  - geometry.tangent-space/green-channel
---

# Tangent space and normal maps

> **In short:** A normal map's colors are directions measured from the surface at each point, tilting the lighting pixel by pixel to fake bumps.
>
> **Used for:** Bolts and scratches on low-poly parts, brick and wood grain, and importing maps from Substance or Unreal.

## A · The basics

### Detail painted into the lighting

Lighting reads a normal at every point. A **normal map** is a texture that tilts that normal at every pixel. The geometry stays flat, but the light catches the tilts, so bumps, grooves, and scratches show without a single extra triangle.

Each pixel's red, green, and blue stand for a direction, each color from 0 to 1 standing for a number from −1 to 1. The "no tilt" color is a pale blue-violet, (0.5, 0.5, 1), which means straight out of the surface. That's why normal maps look mostly blue.

### Directions measured from the surface

Those directions aren't in the world, or even measured from the object. They're measured from the surface at each point, in a fourth space called **tangent space**: the **normal** points straight out (blue), the **tangent** runs along the surface where the texture's u grows (red), and the **bitangent** runs where v grows (green). Because every direction is measured from the surface under it, one map works on every side of a box, on a curved pipe, and on a part that moves.

**Analogy: trail directions.** A trail guide says "the waterfall is on your left," and it's right however the trail twists. "The waterfall is to the north" is only right where the trail happens to run east.

The yellow arrows all come from one map color, tilted toward the texture's right. Turn the panel and switch between the two readings: in tangent space they lean the same way against the surface everywhere, and as world directions they all point the same way.

<div data-scene="tbn"></div>

<details>
<summary>The math, if you're curious</summary>

The shader turns a map direction (x, y, z) into the normal it lights with: tangent × x + bitangent × y + normal × z. The three directions side by side are called the **TBN matrix**.

</details>

### Which way is green?

Tools disagree about whether green means up the image or down it. glTF and three.js read green as up, the +Y or OpenGL convention. Unreal expects down, the −Y or DirectX convention, and Substance can export either. Read a −Y map as +Y and bumps light like dents from top to bottom, while left and right still look fine.

Switch the setting on the studded plate, and move the light.

<div data-scene="greenChannel"></div>

## B · Working knowledge

### Using a normal map

```js
material.normalMap = normalTexture;
material.normalScale.set(1, 1); // how strong: x scales red, y scales green
```

Leave the map's `colorSpace` at `NoColorSpace`, the default: its colors are directions, and marking it `SRGBColorSpace` like a color texture bends every one. A `normalScale` above 1 exaggerates the bumps, and below 1 softens them.

### Fixing a DirectX map

```js
material.normalScale.y *= -1;
```

Multiply, don't set. `GLTFLoader` already sets `normalScale.y` to −1 on meshes whose file stores no tangents, as its own correction, and setting −1 would undo it. You can also flip the green channel in the image itself.

### Tangents: stored or worked out

```js
geometry.computeTangents(); // needs an index, positions, normals, and UVs, or it logs an error
```

With no `tangent` attribute, three.js works out the tangents at every pixel from how the UVs change, so any mesh with UVs works; `computeTangents` stores them instead.

A map only looks right with the tangents it was baked against. On mirrored UVs, where both halves of a symmetric model share one part of the texture, tangents that disagree with the map about the mirroring make one half light as if its bumps were dents.

### Which space is it in?

| Value | Space |
| --- | --- |
| A normal map's colors | Tangent space: measured from the surface at that point |
| `geometry.attributes.normal` and `.tangent` | Measured from the object itself |
| The tilted normal the shader lights with | Measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
