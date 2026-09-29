---
id: 1.assets.draco-meshopt.read-the-code.1
loop: 1
tier: light
concepts: [assets.draco-meshopt]
mode: read-the-code
context: assets.draco-meshopt/payload-budget
lenses: []
misconceptions:
  - assets.draco-meshopt/gpu-memory
---

# Draco vs Meshopt

> **In short:** Draco and Meshopt both shrink a model's geometry for the download, and both are completely unpacked when it loads, so they save network time, not GPU memory.
>
> **Used for:** Keeping a product page's model small enough for phone data; shipping large scans and CAD exports, which are mostly geometry; a build step that picks the compression for each model; and shortening the time a phone spends unpacking a model before an AR view can start.

## A · The basics

### Two ways to pack geometry

Geometry is most of the bytes in a model without big textures: every vertex's position, normal, and UV, plus the index list. The decode, upload, compile page showed decoding as the step that unpacks it. Two compression schemes for glTF geometry are common:

- **Draco** packs geometry very tightly. Unpacking it is real CPU work, so DRACOLoader does it in workers, and its decoder files, about 345 KB, download once per page.
- **Meshopt** rearranges the numbers so they unpack very quickly and so the server's general-purpose compression, gzip or brotli, can shrink them much further. Its decoder is a 29 KB module that comes with three.js.

As a rule of thumb, Draco gives the smallest file on its own. Meshopt decodes much faster, and once the server gzips or brotlis it, most of the size difference goes away.

**Analogy: packing a suitcase.** Vacuum bags (Draco) squeeze clothes the smallest, but take effort to open. Neatly rolled clothes (Meshopt) come close once the suitcase is zipped tight, and unpack in seconds. Either way, once they're hung up the clothes take the same room in the closet, and the closet is GPU memory.

### Unpacked means full size

Decoding gives back the full arrays: the same 4-byte floats for positions and normals that an uncompressed file would give. The GPU gets those arrays, so compression saves nothing there. Brad's rack parts are Draco-compressed: its geometry is about 390 KB in the file and 3.5 MB once decoded.

Pick a part. The blue bar is its geometry in the file and the orange bar is the same geometry decoded, which is what goes to the GPU.

<div data-scene="unpacked"></div>

What does keep numbers small on the GPU is **quantization**: storing positions and normals as 1- or 2-byte whole numbers instead of 4-byte floats, with a scale that turns them back into the right sizes when they're drawn. glTF allows it through the `KHR_mesh_quantization` extension, GLTFLoader supports it, and gltfpack, the meshoptimizer project's command-line tool, quantizes by default. It's separate from compression: a quantized file can be compressed with either scheme or neither.

## B · Working knowledge

### One loader for both

```js
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader()
  .setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))
  .setMeshoptDecoder(MeshoptDecoder);
```

Each file says which scheme it uses, so one loader with both decoders attached handles either.

- **Draco decodes in workers,** up to 4 by default; `dracoLoader.setWorkerLimit(2)` lowers that.
- **Meshopt decodes on the main thread** unless you call `MeshoptDecoder.useWorkers(2)`. It's fast enough that the main thread is usually fine.
- **Neither touches textures.** Images in a model are compressed separately; the KTX2 page covers the GPU-friendly kind.

### A Draco surprise: 4-byte indices

The index list of a glTF file usually stores each index in 2 bytes when the mesh has fewer than 65,536 vertices. DRACOLoader always hands back 4-byte indices (a `Uint32Array`), so a Draco model's indices take twice the memory the file's own accessors describe. On Brad's rack that's 707 KB of indices instead of 354 KB.

### Choosing per asset

These are rules of thumb; measure your own files.

- **Big, geometry-heavy models on slow connections:** Draco, for the smallest download.
- **Many models, phones, or quick switching:** Meshopt, for the fast decode, served with gzip or brotli.
- **Small models:** check that the saving beats the decoder's own download, especially Draco's 345 KB.
- **GPU memory tight:** quantize. Compression alone won't help.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
