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

> **In short:** Each loader reads one kind of file and hands back three.js objects, and each texture class wraps pixels from a different source.
>
> **Used for:** Product models from Blender, price tags drawn on a canvas, reflections from a photo of a room, and video screens.

## A · The basics

### Files in, three.js objects out

Real projects mostly draw things made in other tools, like a rack modeled in Blender or a photo of wood. A **loader** reads one kind of file and turns it into three.js objects. Every loader is called the same two ways:

```js
loader.load(url, onLoad, onProgress, onError); // callbacks
const result = await loader.loadAsync(url);    // a promise
```

A **texture** is a grid of pixels a material paints onto a surface, and there's a texture class for each place pixels come from. Some files are **compressed**, packed into fewer bytes, and need a **decoder** to unpack them, which three.js doesn't attach for you.

**Analogy: travel adapters.** Each adapter turns a different country's socket into the one plug your laptop has, the way each loader turns a different file format into the same three.js objects. Some sockets also need a voltage converter, the way a compressed file needs a decoder.

### The members, at a glance

| Member | What it is | Pick it for | Cost |
| --- | --- | --- | --- |
| `GLTFLoader` | Loads a .glb or .gltf model | Any model from Blender or another 3D tool | A download, then CPU time to build it |
| `DRACOLoader` | GLTFLoader's decoder for Draco geometry | Models compressed with Draco | Decoder files once, then decoding in a worker |
| `MeshoptDecoder` | GLTFLoader's decoder for Meshopt geometry | Models compressed with Meshopt | A fast decode on the main thread |
| `KTX2Loader` | Loads textures the GPU keeps compressed | Many or large textures, especially on phones | Transcoder files once, then work in a worker |
| `HDRLoader` | Loads a .hdr image, brighter than white | Reflections on metal and glass | Twice the GPU memory of a normal image |
| `TextureLoader` | Loads a .jpg or .png | A single image you add yourself | A download, then an upload on first draw |
| `CanvasTexture` | Pixels from a `<canvas>` you draw on | Text, labels, and price tags | The whole canvas uploaded on each update |
| `DataTexture` | Pixels from an array of numbers | Lookup tables and generated patterns | An upload each time it's marked changed |
| `VideoTexture` | Pixels from a playing `<video>` | A video on a screen | An upload for each new video frame |

The glTF structure page opens up a loaded model, the Draco vs Meshopt and KTX2 pages compare the compressed formats, and the environment maps page lights a scene with an HDR image.

Try each button: the rack model with and without its decoder, a price tag redrawn every second with and without `needsUpdate`, and a DataTexture.

<div data-scene="members"></div>

## B · Working knowledge

### Loading a compressed model

```js
const draco = new DRACOLoader().setDecoderPath('/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);
const gltf = await loader.loadAsync('/models/rack.glb');
scene.add(gltf.scene);
```

GLTFLoader has no decoders of its own: without `setDRACOLoader`, a Draco file fails with "No DRACOLoader instance provided". `setKTX2Loader` and `setMeshoptDecoder` attach the other two. The decoder files ship with three.js, so serve them from your site and point `setDecoderPath` at them. Make one loader and reuse it, since each decoder starts its own workers.

### Loading an image or an HDR environment

```js
const wood = new TextureLoader().load('/textures/wood.jpg');
wood.colorSpace = SRGBColorSpace; // for color images
```

`load` hands back the texture before the image arrives, so `wood.image` is `null` on the next line and fills in later. Use `loadAsync` when you need to wait. GLTFLoader sets `colorSpace` on a model's color textures; a texture you load yourself starts with none.

```js
const env = await new HDRLoader().loadAsync('/env/studio.hdr');
env.mapping = EquirectangularReflectionMapping; // a panorama around the scene
scene.environment = env;                        // shiny materials reflect it
```

### A texture you draw or fill

```js
const tag = new CanvasTexture(canvas);
tag.needsUpdate = true; // after every redraw of the canvas
const table = new DataTexture(bytes, 16, 1); // 16 × 1 pixels, 4 bytes each
table.needsUpdate = true; // after filling the array
```

The GPU draws from its own copy, made on the first draw and again only when `needsUpdate` is set. Each update copies the whole canvas, so mark it when the text changes, not every frame. A VideoTexture marks itself changed on each new video frame.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
