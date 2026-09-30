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

> **In short:** Draco and Meshopt shrink a model's geometry for the download, and loading unpacks it fully, so they save network time, not GPU memory.
>
> **Used for:** Payload budgets, decode time on phones, big scans and CAD exports, and picking a compression for each model.

## A · The basics

### Two ways to pack geometry

Geometry is every vertex's position, normal, and UV, plus the index list, and it's most of a model's bytes when the textures are small. **Draco** packs it the tightest, but unpacking it is real CPU work, so DRACOLoader does it in workers. **Meshopt** rearranges the numbers so they unpack very quickly and so the server's gzip or brotli can shrink them further. Draco usually gives the smaller file, but once the server compresses a Meshopt file, most of that gap closes.

**Analogy: packing a suitcase.** Vacuum bags squeeze clothes the smallest but take effort to open, while neatly rolled clothes come close and unpack in seconds. Once they're hung up, the clothes take the same room in the closet either way, and the closet is GPU memory.

### Unpacked means full size

Decoding gives back the same 4-byte numbers an uncompressed file would, and those are what the GPU gets. The rack model is Draco-compressed, and its geometry is about nine times bigger once decoded than in the file.

Pick a part and compare its geometry in the file with what the GPU gets.

<div data-scene="unpacked"></div>

What does keep numbers small on the GPU is **quantization**: storing positions and normals as 1- or 2-byte whole numbers instead of 4-byte floats. It's separate from compression, and gltfpack, Meshopt's command-line tool, applies it by default.

## B · Working knowledge

### One loader for both

```js
const loader = new GLTFLoader()
  .setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))
  .setMeshoptDecoder(MeshoptDecoder);
```

Each file says which scheme it uses, so one loader with both decoders handles either. Meshopt decodes on the main thread unless you call `MeshoptDecoder.useWorkers(2)`, and it's usually fast enough there. Neither touches textures; the KTX2 page covers those.

### A Draco surprise: 4-byte indices

DRACOLoader always hands back the index list as a `Uint32Array`, 4 bytes an index, even when the file's own index list uses 2. So a Draco model's indices can take twice the memory an uncompressed copy's would.

### Choosing per asset

Draco suits big, geometry-heavy models on slow connections. Meshopt, served with gzip or brotli, suits many models, phones, and quick switching. For a small model, check that the saving beats the decoder's own download. When GPU memory is tight, quantize, since compression alone won't help.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
