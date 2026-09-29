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

> **In short:** A normal map is an image whose colors are directions measured from the surface itself, in tangent space, so three.js can tilt the lighting at every pixel and fake bumps and grooves the geometry doesn't have.
>
> **Used for:** Bolts, seams, and scratches on a low-poly part, with no extra triangles; brick, fabric, or wood grain that catches the light; carrying the detail of a high-resolution sculpt over to a lightweight model; and importing maps made in Substance, Blender, or Unreal.

## A · The basics

### Detail painted into the lighting

Lighting reads a normal at every point (the vertex normals page). A **normal map** is a texture that tilts that normal at every pixel. The geometry stays flat, but the light catches the tilts, so bumps, grooves, and scratches show without a single extra triangle.

Each pixel's color is a direction: red for the first part, green for the second, blue for the third, each color from 0 to 1 standing for a number from −1 to 1. The "no tilt" color is a pale blue-violet, (0.5, 0.5, 1), which stands for (0, 0, 1): straight out of the surface. That's why normal maps look mostly blue.

### Directions measured from the surface

Those directions aren't in the world, or even measured from the object. They're measured from the surface itself, at each point, using three directions called **tangent space**:

- the **normal**, straight out of the surface, the blue part;
- the **tangent**, along the surface in the direction the texture's u grows (the UVs page), the red part;
- the **bitangent**, along the surface in the direction v grows, the green part.

Together they're often called the **TBN**. Tangent space is a fourth space, next to the object's own space, the world, and camera space. Because every direction is measured from the surface under it, one map works on every side of a box, on a curved pipe, and on a part that moves or turns.

**Analogy: trail directions.** A trail guide says "the waterfall is on your left," measured from the way the trail runs, and it's right however the trail twists. "The waterfall is to the north" is only right where the trail happens to run east. Normal maps give directions the way the guide does.

The yellow arrows all come from the same map color, one tilted toward the texture's right. Read in tangent space, each one leans the same way against the surface under it. Read as a world direction, they all point the same way in the scene, whichever way the surface faces. The red, green, and blue arrows are each point's tangent, bitangent, and normal.

<div data-scene="tbn"></div>

<details>
<summary>The math, if you're curious</summary>

Each channel stores a number from −1 to 1 as a color from 0 to 1: direction = color × 2 − 1. The tangent, bitangent, and normal side by side make the **TBN matrix**; multiplying a direction from the map by it turns it into the space the shader lights in.

</details>

### Which way is green?

Tools disagree about one thing: whether green means up the image or down it.

- **+Y, the OpenGL convention:** green means up, toward growing v. glTF files use it (the glTF spec: "+X is right and +Y is up"), and so does three.js.
- **−Y, the DirectX convention:** green means down. Unreal Engine is usually described as expecting this kind, and its textures have a "Flip Green Channel" setting for converting. Substance and most baking tools can export either.

Read a −Y map as +Y and the up-and-down tilts come out backward: bumps light like dents from top to bottom, while left and right still look fine. Switch the setting on the studded plate, and move the light.

<div data-scene="greenChannel"></div>

## B · Working knowledge

### Using a normal map

```js
material.normalMap = normalTexture;
material.normalScale.set(1, 1); // how strong: x scales red, y scales green
```

- **Leave a normal map's `colorSpace` at `NoColorSpace`,** the default for a texture. Its colors are directions, not colors, and marking it `SRGBColorSpace`, as you would a color texture, bends every direction. The color spaces page, in the materials domain, covers why.
- `normalScale` above 1 exaggerates the bumps, and below 1 softens them.

### Fixing a DirectX map

Flip the green part on the material:

```js
material.normalScale.y *= -1;
```

Multiply, don't set. `GLTFLoader` already sets `normalScale.y` to −1 on meshes whose file stores no tangents. That's its own correction for how glTF lays out textures (the UVs page), not a DirectX map, and setting `normalScale.y = -1` there would undo it. The other fix is to flip the green channel in the image itself, before it ships.

### Tangents: stored or worked out

- With no `tangent` attribute, three.js works out the tangent and bitangent at every pixel from how the UVs change across the screen. It works on any mesh with UVs.
- `geometry.computeTangents()` stores them instead, in a `tangent` attribute with 4 numbers per vertex. It needs an index, positions, normals, and UVs; without them it logs an error and does nothing. A glTF file can also bring its own.
- Baking tools work out tangents in one particular way, most often a standard called MikkTSpace, and a map only looks right with the tangents it was baked against. three.js's own docs say `computeTangents` probably won't match other software's tangents, and that a mismatch shows as subtle errors, especially around mirrored UV seams. `computeMikkTSpaceTangents`, in `three/addons/utils/BufferGeometryUtils.js`, matches the standard; you pass it the MikkTSpace library from `three/addons/libs/mikktspace.module.js`, after waiting for `MikkTSpace.ready`.

### Mirrored UVs

To save texture space, artists often lay one half of a symmetric model over the same part of the texture as the other half. On the mirrored half, the u direction runs backward, so its tangent frame is flipped. The tangent's fourth number, `w`, records that flip, and three.js uses it. When the tangents or the map don't agree about the mirroring, one half lights as if its bumps were dents.

### Object-space normal maps

`material.normalMapType = ObjectSpaceNormalMap` reads the colors as directions measured from the object itself instead. Those maps can't be reused on other shapes and break if the mesh deforms, so they're rare. The default, `TangentSpaceNormalMap`, is what nearly every tool exports.

### Which space is it in?

| Value | Space |
| --- | --- |
| A tangent-space normal map's colors | Tangent space: measured from the surface at that point |
| `geometry.attributes.normal` and `geometry.attributes.tangent` | Measured from the object itself |
| A map's colors with `normalMapType = ObjectSpaceNormalMap` | Measured from the object itself |
| The tilted normal the shader lights with | Camera space: measured from the camera |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
