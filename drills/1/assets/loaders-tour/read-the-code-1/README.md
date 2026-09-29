---
id: 1.assets.loaders-tour.read-the-code.1
loop: 1
tier: light
concepts: [assets.loaders-tour]
mode: read-the-code
context: assets.loaders-tour/compressed-model
lenses: []
misconceptions:
  - assets.loaders-tour/loader-alone
  - assets.loaders-tour/canvas-follows
---

# Tour: loaders and textures

> **In short:** Loaders turn files such as models and images into three.js objects, and texture classes wrap any grid of pixels, from a file, a canvas, an array, or a video, so a material can draw with it.
>
> **Used for:** Showing a product model exported from Blender; drawing a price tag or a name badge with the 2D canvas; lighting shiny metal with a photo of a real room; and playing a video on a screen inside a showroom.

## A · The basics

### Files in, three.js objects out

Shapes built in code, like a `BoxGeometry`, only go so far. Real projects mostly draw things made in other tools, like a rack modeled in Blender or a photo of wood. A **loader** reads one kind of file and turns it into three.js objects you can add to the scene. Every loader is called the same two ways:

```js
loader.load(url, onLoad, onProgress, onError); // callbacks
const result = await loader.loadAsync(url);    // a promise
```

A **texture** is a grid of pixels that a material paints onto a surface. three.js doesn't care where the pixels come from: an image file, a `<canvas>` you draw on, an array of numbers, or a playing video each have a texture class.

Some files are **compressed**: packed into fewer bytes to download faster. A compressed file needs a **decoder**, a small program that unpacks it again, and three.js doesn't attach one for you.

**Analogy: travel adapters.** Your laptop has one kind of plug. Each adapter turns a different country's wall socket into that plug, the way each loader turns a different file format into the same three.js objects. Some sockets need a voltage converter as well as the adapter, and a compressed file needs its decoder as well as the loader.

### The members, at a glance

| Member | What it is | Reach for it when | Cost |
| --- | --- | --- | --- |
| `GLTFLoader` | Loads a .glb or .gltf model: its meshes, materials, textures, and how the parts hang together | Any model from Blender or another 3D tool | A download, then CPU time to build the objects |
| `DRACOLoader` | A decoder GLTFLoader hands Draco-compressed geometry to | The model's geometry was compressed with Draco | Its decoder files download once; decoding runs in a worker, a background thread |
| `MeshoptDecoder` | A decoder for Meshopt-compressed geometry | The model was compressed with Meshopt | A small decoder that runs on the main thread unless you give it workers |
| `KTX2Loader` | Loads KTX2 textures, a compressed format the GPU can read without unpacking | Models with many or large textures, especially on phones | Its transcoder files download once; the work runs in a worker |
| `HDRLoader` | Loads a .hdr image, whose pixels can be brighter than white, for lighting | Realistic reflections on metal and glass | Twice the GPU memory of a normal image of the same size |
| `TextureLoader` | Loads a .jpg or .png as a texture | Any single image you put on a material yourself | A download and an image decode; copied to the GPU when first drawn |
| `CanvasTexture` | A texture that reads a `<canvas>` you draw on with the 2D canvas API | Text, labels, and price tags | Copies the whole canvas to the GPU each time you mark it changed |
| `DataTexture` | A texture made from an array of numbers | Lookup tables, generated patterns, data | Copied to the GPU when you mark it changed |
| `VideoTexture` | A texture that reads a playing `<video>` | A video on a screen or a surface | Copies each new video frame to the GPU |

This page only maps them out. The glTF structure page opens up what a loaded model contains, the Draco vs Meshopt and KTX2 pages compare the compressed formats, and Domain 11 covers lighting with HDR images.

Try each button. The first loads Brad's rack parts, a Draco-compressed model. The second loads the same file with no decoder attached. The canvas buttons redraw a price tag every second, one with `needsUpdate = true` and one without.

<div data-scene="members"></div>

## B · Working knowledge

### Loading a model with its decoders

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const draco = new DRACOLoader().setDecoderPath('/draco/'); // the folder you serve the decoder files from
const ktx2 = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
const loader = new GLTFLoader()
  .setDRACOLoader(draco)
  .setKTX2Loader(ktx2)
  .setMeshoptDecoder(MeshoptDecoder);

const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
```

- **Decoders are opt-in.** Loading a Draco-compressed file with no `setDRACOLoader` fails with "No DRACOLoader instance provided." A file that requires KTX2 or Meshopt fails too, with a message naming the missing `setKTX2Loader` or `setMeshoptDecoder`. The error arrives the way every load error does: `loadAsync` rejects, or `load` calls `onError`. When a file marks KTX2 or Meshopt as optional instead of required, GLTFLoader doesn't fail without the decoder: it quietly falls back to the file's uncompressed copy.
- **The decoder files ship with three.js,** in `three/examples/jsm/libs/draco/` and `libs/basis/`. Serve them from your site and point `setDecoderPath` and `setTranscoderPath` at them.
- **Make one of each and reuse it.** Each DRACOLoader and KTX2Loader starts its own workers, so share one GLTFLoader across the app. `KTX2Loader` also needs `detectSupport(renderer)` before its first load, or the load fails with "Missing initialization with `.detectSupport( renderer )`."
- **What comes back** is an object, not a mesh: `gltf.scene` is a `Group` holding the model, with `gltf.animations` and `gltf.cameras` beside it. The glTF structure page covers what's inside.

### Lighting from an HDR image

```js
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const env = await new HDRLoader().loadAsync('/env/studio.hdr');
env.mapping = EquirectangularReflectionMapping; // the image is a panorama wrapped around the scene
scene.environment = env;                        // shiny materials reflect it
```

`RGBELoader` is the old name for the same loader. r186 still has it, but it's deprecated and warns you to use `HDRLoader`. Its pixels are half-floats, 8 bytes each instead of 4, which the runtime memory math page puts in numbers.

### A single image

```js
const wood = new TextureLoader().load('/textures/wood.jpg');
wood.colorSpace = SRGBColorSpace; // for color images; the color spaces page in Domain 11 explains why
material.map = wood;
```

- **`load` hands back the texture straight away, before the image has arrived.** On the next line, `wood.image` is still `null`; the image fills in later. Use `await loader.loadAsync(url)` when you need the image first.
- **It has no progress events.** `TextureLoader` never calls `onProgress`.
- GLTFLoader sets `colorSpace` on a model's color textures for you. A texture you load yourself starts with none.

### A texture you draw: CanvasTexture

```js
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 256;
const ctx = canvas.getContext('2d');
const tag = new CanvasTexture(canvas);

ctx.fillText('$129', 40, 160);
tag.needsUpdate = true; // after every redraw
```

- **The GPU has a copy, not the canvas.** A texture is copied to the GPU when it's first drawn and again only when `needsUpdate = true`. The constructor sets it once, which is why the first drawing shows up and later ones don't.
- Each update copies the whole canvas, so redraw and mark it when the text changes, not every frame.

### A texture from numbers: DataTexture

```js
const data = new Uint8Array(16 * 4);             // red, green, blue, alpha for each of 16 pixels
const strip = new DataTexture(data, 16, 1);      // 16 pixels wide, 1 tall
strip.needsUpdate = true;                        // it isn't copied to the GPU until you set this
```

A DataTexture starts out as one byte per value, four values per pixel, and with `NearestFilter`, so each pixel draws as a sharp block instead of blending into its neighbors. That suits lookup tables, where each pixel is a separate entry.

### A video: VideoTexture

```js
const screen = new VideoTexture(videoElement);
videoElement.play();
```

A VideoTexture marks itself changed each time the video has a new frame, so there's no `needsUpdate` to call. It skips mipmaps, the smaller copies a texture keeps for drawing far away.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
