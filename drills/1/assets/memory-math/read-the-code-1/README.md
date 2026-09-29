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

> **In short:** What a model costs in memory is set by how many vertices and pixels it has and how each is stored, not by its file size, and a few sums in code give you the number.
>
> **Used for:** Checking that a product model fits on a phone before it ships; working out why a tab crashes on a phone but not on a laptop; choosing the lighter of two versions of a model; and setting texture sizes for the artists making the models.

## A · The basics

### Two things take the memory

The decode, upload, compile page showed that the GPU gets the unpacked arrays and pixels. Their size comes from two things:

- **Geometry:** every vertex stores numbers, 4 bytes each as floats. A position is 3 of them, a normal 3, and a UV 2, so a vertex with all three costs 32 bytes. The index list adds 2 or 4 bytes per index, three indices per triangle.
- **Textures:** every pixel costs 4 bytes as 8-bit color with alpha, and mipmaps, the smaller copies for drawing at a distance, add a third. Half-float pixels, which HDR images use, cost 8 bytes and full floats 16.

The file hides both: JPG, PNG, and Draco all shrink the file, and all of them are undone before the GPU sees the data. The GPU formats from the KTX2 page are the one exception.

**Analogy: a tent in its bag.** The bag is what you carry, the file. Once it's pitched, the tent covers the ground its floor size says, however small the bag packed. Memory math is reading the floor size off the label instead of weighing the bag.

Pick one of Brad's models. The blue bar is its file and the other bar is what it takes on the GPU: geometry in orange, textures in green.

<div data-scene="footprint"></div>

<details>
<summary>The math, if you're curious</summary>

Why mipmaps add a third: each smaller copy, called a **mip level**, has half the width and half the height of the one before, so a quarter of its pixels. The whole **mip chain** adds 1/4 + 1/16 + 1/64 + …, which comes to 1/3. So a texture costs width × height × bytes per pixel × 4/3. For a 1024 × 1024 color texture: 1024 × 1024 × 4 × 4/3, about 5.6 MB.

</details>

## B · Working knowledge

### A model's footprint, in code

```js
const geometries = new Set();
const textures = new Set();
model.traverse((object) => {
  if (!object.isMesh) return;
  geometries.add(object.geometry);
  for (const value of Object.values(object.material)) if (value?.isTexture) textures.add(value);
});

let bytes = 0;
for (const geometry of geometries) {
  for (const attribute of Object.values(geometry.attributes)) bytes += attribute.array.byteLength;
  if (geometry.index) bytes += geometry.index.array.byteLength;
}
for (const texture of textures) {
  const { width, height } = texture.image;
  const full = TextureUtils.getByteLength(width, height, texture.format, texture.type);
  const hasMipmaps = texture.generateMipmaps || texture.mipmaps.length > 1; // KTX2 files bring their own
  bytes += hasMipmaps ? full * (4 / 3) : full;
}
```

- **Count each geometry and texture once.** Meshes share them, which is why the code collects them into Sets first.
- **`TextureUtils.getByteLength(width, height, format, type)`** gives the full-size image's bytes for any format, compressed ones included. It leaves out mipmaps, so add a third when the texture has them.
- **`attribute.array.byteLength`** is exactly what's uploaded. Attributes that share one interleaved array would be counted twice by this loop; the interleaved attributes page covers them.
- **`renderer.info.memory`** counts geometries and textures on the GPU, not bytes. It's the quick check that disposal worked, which the disposal ownership page uses.

### What else uses memory

- **The JavaScript copies.** After uploading, three.js keeps the arrays and images, since raycasting and bounding boxes read them. A model costs its memory twice: once in JavaScript, once on the GPU.
- **The canvas and render targets,** which grow with the square of the device pixel ratio. The resolution and DPR page in Domain 14 covers them.
- **Shadow maps and environment maps,** which are textures the renderer makes for you.

### Why phones crash

A phone's browser gives a page far less memory than a desktop does. A page that asks for more GPU memory than it can have may lose its WebGL context, which fires a `webglcontextlost` event and blanks the canvas, or the browser may reload the tab. Add up everything that's loaded at the same time, including models that are hidden or no longer shown but never disposed.

### Comparing versions of a model

Try the texture sizes and formats: the base is the full-size image, and each layer above it is the next mip level.

<div data-scene="mipPyramid"></div>

- **Halving a texture's width and height cuts its memory to a quarter.** A 4096 × 4096 texture costs as much as sixteen 1024 × 1024 ones.
- **Every map counts:** a material with a color, normal, and roughness map has three textures, each costing its own pixels.
- **Two files of the same size can differ tenfold in memory.** Compare pixel counts and formats, never file sizes.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
