---
id: 1.assets.memory-math.read-the-code.1
loop: 1
tier: core
concepts: [assets.memory-math]
mode: read-the-code
context: assets.memory-math/footprint
lenses: []
misconceptions:
  - assets.memory-math/file-equals-memory
---

# Runtime memory math

> **In short:** A model's memory is set by how many vertices and pixels it has and how each is stored, never by its file size.
>
> **Used for:** A model's footprint, tab crashes on phones, comparing two versions of a model, and texture sizes for artists.

## A · The basics

### Two things take the memory

The GPU gets unpacked arrays and pixels, and their size comes from two things. **Geometry** stores 4-byte numbers for every vertex: a position, normal, and UV together cost 32 bytes, and each index adds 2 or 4. **Textures** cost 4 bytes a pixel for ordinary color images, and **mipmaps**, the smaller copies for drawing at a distance, add a third. JPG, PNG, and Draco all shrink the file, and all are undone before the GPU sees the data.

**Analogy: a tent in its bag.** The bag is what you carry, the file. Once it's pitched, the tent covers the ground its floor size says, however small the bag packed.

Pick a model and compare its file with what it takes on the GPU.

<div data-scene="footprint"></div>

<details>
<summary>The math, if you're curious</summary>

Each smaller copy has a quarter of the pixels of the one before, so the whole **mip chain** adds 1/4 + 1/16 + 1/64 + …, which comes to 1/3. A texture costs width × height × bytes per pixel × 4/3: for a 1024 × 1024 color texture, about 5.6 MB.

</details>

## B · Working knowledge

### A model's footprint, in code

Collect each geometry and texture into a Set first, since meshes share them, then add up their bytes:

```js
for (const attribute of Object.values(geometry.attributes)) bytes += attribute.array.byteLength;
if (geometry.index) bytes += geometry.index.array.byteLength;
const full = TextureUtils.getByteLength(width, height, texture.format, texture.type);
bytes += texture.generateMipmaps || texture.mipmaps.length > 1 ? full * (4 / 3) : full;
```

`getByteLength` gives the full-size image's bytes for any format, compressed ones included, but leaves out mipmaps. `renderer.info.memory` counts geometries and textures on the GPU, not bytes; it's the quick check that disposal worked.

### What else uses memory

three.js keeps the arrays and images in JavaScript after uploading them, since raycasting and bounding boxes read them, so a model costs its memory twice. The canvas, render targets, shadow maps, and environment maps take GPU memory too.

### Why phones crash

A phone's browser gives a page far less memory than a desktop does. Ask for too much and the page may lose its WebGL context, which blanks the canvas, or the browser may reload the tab. Add up everything loaded at once, including models that are hidden, or removed but never disposed.

### Comparing versions of a model

Halving a texture's width and height cuts its memory to a quarter, so one 4096 × 4096 texture costs as much as sixteen 1024 × 1024 ones. Each map on a material counts on its own, and HDR images use half floats, 8 bytes a pixel. Two files of the same size can differ tenfold in memory, so compare pixel counts and formats, never file sizes.

Try the sizes and formats: each layer is the next mip level.

<div data-scene="mipPyramid"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
