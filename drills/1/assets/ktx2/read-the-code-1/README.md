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

> **In short:** A JPG or PNG is small only as a file, because the GPU gets every pixel unpacked at 4 bytes each, while a KTX2 texture stays compressed in GPU memory in a format the GPU reads directly.
>
> **Used for:** Fitting a texture-heavy product into a phone's limited GPU memory; a fabric or finish library with hundreds of swatches; large terrain and environment textures in games; and cheaper texture uploads, so switching finishes doesn't stall.

## A · The basics

### A JPG is small only as a file

JPG and PNG are made for downloading. The GPU can't read either one, so the browser decodes the image to raw pixels first: red, green, blue, and alpha, 1 byte each, so 4 bytes a pixel. Then three.js usually adds **mipmaps**, the smaller copies a texture keeps for drawing at a distance, which add a third more.

Brad's J-cups file has a sticker texture: a 512 × 512 PNG of 36.8 KB. On the GPU it's 512 × 512 × 4 bytes, 1 MB, plus mipmaps, 1.4 MB: 38 times the file.

### Formats the GPU reads directly

GPUs can read a few compressed formats as they are, a small block of pixels at a time, without unpacking them in memory: BC7 on most desktop GPUs, and ASTC or ETC2 on most phones, as a rule. These cost 1 byte a pixel or less instead of 4.

No one of those works on every device, so a **KTX2** file holds **Basis Universal** data, an in-between format. When it loads, KTX2Loader **transcodes** it, a quick conversion in a worker, into whichever of those formats this device's GPU reads. If the GPU reads none of them, KTX2Loader falls back to raw 4-byte pixels and the saving is gone.

**Analogy: a letter in shorthand.** A JPG is like a letter zipped up for email: small to send, but the reader unzips it back to full length before reading it. A GPU format is shorthand the reader can read as it is, so it stays short on the page. Basis is a shorthand made so that any reader can have it rewritten into their own shorthand in a moment.

Compare the sticker as its PNG and as it would be from KTX2. The last line of the readout is what this browser's GPU can read.

<div data-scene="formats"></div>

## B · Working knowledge

### Loading KTX2

```js
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const ktx2 = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
gltfLoader.setKTX2Loader(ktx2);                          // for models whose textures are KTX2
const swatch = await ktx2.loadAsync('/textures/oak.ktx2'); // or a texture on its own
```

- **`detectSupport(renderer)` is required.** It asks the renderer which compressed formats this GPU reads, and loading without it fails with "Missing initialization with `.detectSupport( renderer )`."
- **Use one KTX2Loader.** Each one downloads the transcoder, about 585 KB, and starts its own workers; r186 warns in the console when several are active.
- **The file brings its own mipmaps.** The GPU can't build mipmaps for a compressed texture, so they're made when the file is. A file without them loads with mipmap filtering turned off, so the texture can shimmer at a distance.
- **The color space comes from the file.** KTX2Loader reads it from the KTX2 data, where a texture you load with TextureLoader needs `colorSpace` set by hand. Domain 11 covers color spaces.

### Making KTX2 files

KTX2 files are made in a build step, with tools such as KTX-Software's `toktx`, `gltf-transform`, or Basis's own `basisu`. Basis has two modes, and as a rule of thumb: ETC1S makes smaller files at lower quality, which suits color textures; UASTC makes bigger files at higher quality, which suits normal maps and fine detail.

### Budgeting texture memory

- **Count pixels, not file size.** A 2048 × 2048 texture is about 22 MB as raw pixels with mipmaps, whether its JPG is 200 KB or 2 MB. The runtime memory math page does these sums.
- **Compressed formats cut that to a quarter or less,** and the GPU samples them directly, with less data to upload as well.
- **Check the fallback.** On a device whose GPU reads none of the formats, KTX2 textures are as big as JPGs in memory.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
