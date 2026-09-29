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

> **In short:** UVs are 2D coordinates stored at each vertex that say which spot of a texture image lands there, usually 0 to 1 across the image.
>
> **Used for:** Wrapping a label, a logo, or a wood grain onto a model; tiling a floor or wall pattern many times across one big surface; baked lighting and shadows, stored with a second set of UVs; and finding the spot on a texture under the pointer, for painting on a model.

## A · The basics

### A spot in the picture for every vertex

A **texture** is an image a material paints onto a mesh. To know which part of the image goes where, every vertex stores a **UV**: two numbers, `u` across the image from 0 at the left edge to 1 at the right, and `v` up it from 0 at the bottom to 1 at the top. They're called u and v because x, y, and z are taken.

UVs live in the geometry's `uv` attribute, with an `itemSize` of 2 (the BufferAttribute and itemSize page). Across a triangle, the GPU blends its three corners' UVs, so every pixel in between gets its own spot in the image.

**Analogy: a sewing pattern.** A dress starts as flat pieces of fabric. Each point where the pieces are stitched together matches a marked point on the flat pattern. UVs are those marks: for every corner of the 3D shape, a spot on the flat picture.

### Past 1, the texture decides

UVs aren't limited to 0 to 1. A UV of 3 is three image-widths across, and what shows there is up to the texture's **wrap** setting:

- `ClampToEdgeWrapping`, the default: past the edge, the edge pixels stretch out.
- `RepeatWrapping`: the image tiles, so UVs from 0 to 3 show it three times.
- `MirroredRepeatWrapping`: it tiles, flipping every other copy.

Stretch the panel's UVs past 1 and switch the wrap setting. The numbers in the corners are the UVs of the panel's corners.

<div data-scene="wrap"></div>

## B · Working knowledge

### Reading and changing UVs

```js
const uv = geometry.attributes.uv; // itemSize 2
uv.getX(i); // u of vertex i
uv.getY(i); // v of vertex i
```

`hit.uv` from a raycast is the UV at the exact spot the ray hit, blended from the triangle's corners: the spot in the image under the pointer.

### Tiling

```js
floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
floorTexture.repeat.set(8, 8); // 8 tiles each way, without touching the geometry
```

- `repeat` and `offset` scale and shift the UVs as the texture is read, so the geometry stays the same.
- Wrap settings go to the GPU with the image. If you change `wrapS` or `wrapT` after the texture has been drawn, set `texture.needsUpdate = true` so it's sent again.
- `GLTFLoader` sets `flipY = false` on the textures it loads, to match the way glTF files lay out their UVs, so they come out right on their own. A texture you load yourself for a glTF model needs the same setting.

### Generating box UVs

A shape built in code, or a scan, may have no useful UVs. The simplest fix is to project them from the positions, like a slide projector shining the image straight down onto a floor:

```js
const tile = 0.5; // one tile per half meter
const uv = new BufferAttribute(new Float32Array(position.count * 2), 2);
for (let i = 0; i < position.count; i++) uv.setXY(i, position.getX(i) / tile, position.getZ(i) / tile);
geometry.setAttribute('uv', uv);
```

The UVs run far past 1, so use `RepeatWrapping`. Because they come from real sizes, a tile is the same size on every object. For a box, project each face from its own side: the "box mapping" in many tools picks the direction a face's normal points most along. `BoxGeometry` already gives every face its own full 0 to 1 square.

### A second set for baked light

A **lightmap** is an image of baked light and shadow. It needs every surface to have its own spot in the image, with no two surfaces sharing one, while a color texture is free to tile or reuse spots. So a model often carries a second set of UVs, `uv1`:

```js
geometry.setAttribute('uv1', bakedUVs);
material.lightMap = bakedLight;
bakedLight.channel = 1; // read uv1 instead of uv
```

Every map reads the UV set its texture's `channel` names, and `channel` starts at 0, the first set, `uv`. Without `channel = 1`, the lightmap reads `uv` and lands in the wrong places. `GLTFLoader` sets `channel` for you from the file.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
