---
id: 1.geometry.uvs.read-the-code.1
loop: 1
tier: light
concepts: [geometry.uvs]
mode: read-the-code
context: geometry.uvs/texture-mapping
lenses: []
misconceptions:
  - geometry.uvs/zero-to-one
---

# UVs

> **In short:** UVs pin each vertex to a spot on a texture image, usually counted from 0 to 1 across it.
>
> **Used for:** Wrapping labels and wood grain onto models, tiling floors, baked lighting, and painting on a model under the pointer.

## A · The basics

### A spot in the picture for every vertex

A **texture** is an image a material paints onto a mesh. To know which part of the image goes where, every vertex stores a **UV**: two numbers, `u` across the image from 0 at the left edge to 1 at the right, and `v` up it from 0 at the bottom to 1 at the top. They live in the `uv` attribute, with an `itemSize` of 2. Across a triangle, the GPU blends its corners' UVs, so every pixel in between gets its own spot in the image.

**Analogy: a sewing pattern.** A dress starts as flat pieces of fabric, marked where each point gets stitched. UVs are those marks: for every corner of the 3D shape, a spot on the flat picture.

### Past 1, the texture decides

UVs aren't limited to 0 to 1. A UV of 3 is three image-widths across, and what shows there is up to the texture's **wrap** setting:

- `ClampToEdgeWrapping`, the default: past the edge, the edge pixels stretch out.
- `RepeatWrapping`: the image tiles, so UVs from 0 to 3 show it three times.
- `MirroredRepeatWrapping`: it tiles, flipping every other copy.

Stretch the panel's UVs past 1 and switch the wrap setting. The numbers at the corners are their UVs.

<div data-scene="wrap"></div>

## B · Working knowledge

### Tiling a floor

```js
floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
floorTexture.repeat.set(8, 8); // 8 tiles each way, without touching the geometry
```

`repeat` scales the UVs as the texture is read, so the geometry stays the same. Changing `wrapS` or `wrapT` after the texture has been drawn also needs `texture.needsUpdate = true`. `hit.uv` from a raycast is the UV at the exact spot the ray hit.

### Generating UVs from positions

A shape built in code, or a scan, may have no useful UVs. Project them from the positions, like a slide projector shining straight down onto a floor:

```js
const uv = new BufferAttribute(new Float32Array(position.count * 2), 2);
for (let i = 0; i < position.count; i++) uv.setXY(i, position.getX(i) / tile, position.getZ(i) / tile);
geometry.setAttribute('uv', uv); // tile: the size of one tile, like 0.5
```

The UVs run far past 1, so use `RepeatWrapping`, and a tile comes out the same size on every object. Box mapping does this from three sides, projecting each face along the direction its normal points most.

### A second set for baked light

A **lightmap** is an image of baked light and shadow, and it needs its own UVs, `uv1`, where no two surfaces share a spot. Every map reads the UV set its texture's `channel` names, and `channel` starts at 0, which means `uv`:

```js
geometry.setAttribute('uv1', bakedUVs);
material.lightMap = bakedLight;
bakedLight.channel = 1; // read uv1 instead of uv
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
