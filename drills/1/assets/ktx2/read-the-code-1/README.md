---
id: 1.assets.ktx2.read-the-code.1
loop: 1
tier: light
concepts: [assets.ktx2]
mode: read-the-code
context: assets.ktx2/mobile-vram
lenses: []
misconceptions:
  - assets.ktx2/jpg-memory
---

# KTX2 and Basis textures

> **In short:** A JPG is small only as a file, while a KTX2 texture stays compressed on the GPU, in a format the GPU reads directly.
>
> **Used for:** Phone GPU memory budgets, large swatch libraries, texture-heavy products, and quicker texture uploads.

## A · The basics

### A JPG is small only as a file

The GPU can't read JPG or PNG, so the browser decodes each image to raw pixels at 4 bytes each. three.js then usually adds **mipmaps**, smaller copies for drawing at a distance, which add a third. The J-cups model's sticker is a small PNG that takes 38 times its file size on the GPU.

### Formats the GPU reads directly

GPUs can read a few compressed formats as they are, at 1 byte a pixel or less, such as BC7 on most desktops and ASTC on most phones. No one format works everywhere, so a **KTX2** file holds an in-between format, **Basis Universal**. As it loads, KTX2Loader **transcodes** it, a quick conversion in a worker, into whichever format this GPU reads. If the GPU reads none of them, it falls back to raw 4-byte pixels and the saving is gone.

**Analogy: a letter in shorthand.** A JPG is like a letter zipped for email: small to send, but unzipped to full length before anyone reads it. A GPU format is shorthand the reader reads as it is, and Basis is shorthand any reader can have rewritten into their own in a moment.

Compare the sticker as a PNG and as KTX2 on each kind of GPU.

<div data-scene="formats"></div>

## B · Working knowledge

### Loading KTX2

```js
const ktx2 = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
gltfLoader.setKTX2Loader(ktx2);                            // for models with KTX2 textures
const swatch = await ktx2.loadAsync('/textures/oak.ktx2'); // or a texture on its own
```

`detectSupport(renderer)` asks which formats this GPU reads, and a load without it fails. Use one KTX2Loader for the whole app, since each one downloads the transcoder and starts its own workers. The file brings its own color space, and its own mipmaps, since the GPU can't build them for a compressed texture. A file made without mipmaps can shimmer at a distance.

### Making KTX2 files

KTX2 files are made ahead of time in a build step, for example with `gltf-transform`. Basis has two modes: ETC1S makes smaller files that usually suit color textures, and UASTC keeps more detail for normal maps.

### Budgeting texture memory

Count pixels, not file size: a 2048 × 2048 texture is about 22 MB with mipmaps, whether its JPG is 200 KB or 2 MB. GPU-compressed formats cut that to a quarter or less and upload less data too. On a device that reads none of them, KTX2 textures cost as much as JPGs.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
