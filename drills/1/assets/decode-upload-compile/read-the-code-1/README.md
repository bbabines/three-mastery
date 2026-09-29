---
id: 1.assets.decode-upload-compile.read-the-code.1
loop: 1
tier: core
concepts: [assets.decode-upload-compile]
mode: read-the-code
context: assets.decode-upload-compile/prewarm
lenses: []
misconceptions:
  - assets.decode-upload-compile/renders-instantly
---

# Decode, upload, compile

> **In short:** A loaded model still has to be copied to the GPU and have its shaders compiled before it can be drawn, and three.js does both on the first frame that draws it unless you ask for them earlier.
>
> **Used for:** Avoiding a freeze the first time a shopper opens a product's finish options; switching a configurator to a new variant without a stutter; warming everything up behind a loading screen so the first frame is smooth; and working out why a game stutters the first time a new effect appears.

## A · The basics

### Four costs, not one

The load lifecycle page ended at "done isn't drawn". Here's the whole path from a file on a server to pixels on screen:

| Step | What happens | Where it runs | When three.js does it |
| --- | --- | --- | --- |
| Download | The file's bytes arrive | The network | During the load |
| Decode | Packed bytes become arrays and pixels: Draco geometry is unpacked, PNGs and JPGs become raw pixels | The CPU, mostly off the main thread: Draco in workers, images in the browser's decoder | During the load, before `onLoad` |
| Upload | Geometry arrays and texture pixels are copied into GPU memory | The main thread hands them to the GPU | The first render that draws them |
| Compile | Each new kind of material gets a shader program built for it | The GPU's driver, while the main thread waits | The first render that draws it |

File size only tells you about the first step. The last two happen on the main thread's time, in the middle of a frame, so the page can't respond until they finish.

**Analogy: a kitchen adding a new dish.** The ingredients are delivered (download) and unpacked in the back (decode). Then they have to be stocked on the line (upload), and the cooks have to learn the recipe (compile). If all that happens when the first order comes in, that customer waits. A good kitchen does it before opening.

### What a shader program is

Every material is drawn by a small program that runs on the GPU, called a **shader**. three.js writes it from the material's settings: its type, which maps it has, how many lights the scene has, whether there's fog. Then the GPU's driver compiles it. Materials whose settings match share one program, so the eleven materials on Brad's rack parts need only two programs: one for materials with a color map and one for materials without.

### Doing the work early

`renderer.compileAsync` compiles the shaders for a model before it's in the scene, and `renderer.initTexture` uploads a texture early. Geometry has no separate call; it uploads on the first render that draws it.

Step through a warm-up of Brad's rack parts. Each button starts over and runs the steps up to that one. The readout counts what's on the GPU for the model, and the last two buttons show what the first render had to do, with and without the warm-up.

<div data-scene="warmUp"></div>

## B · Working knowledge

### Warming up a model before it's shown

```js
const gltf = await loader.loadAsync('/models/rack.glb');
await renderer.compileAsync(gltf.scene, camera, scene); // shaders only
gltf.scene.traverse((object) => {
  if (object.isMesh && object.material.map) renderer.initTexture(object.material.map);
});
scene.add(gltf.scene); // the first render still uploads the geometry
```

- **The third argument is the scene the model is about to join.** three.js reads its lights and environment, because how many lights there are and whether there's an environment are part of every lit material's program. Set up lights and `scene.environment` before calling it. Adding a light afterwards means the next render compiles again.
- **`compileAsync` does shaders only.** It uploads no geometry and no textures; `initTexture` does one texture, including one you loaded yourself.
- **Prefer `compileAsync` over `renderer.compile`.** When the browser can compile in the background (the `KHR_parallel_shader_compile` extension), it waits for the compile without freezing the page. Without that extension, it does the same as `renderer.compile`.
- **Geometry uploads on the first render that draws it.** To get it done early too, add the model while a loading screen covers the canvas and let one frame render.

### The first-interaction hitch

A model that's loaded but hidden, like a finish swatch panel or the next room of a tour, hasn't cost the GPU anything yet. The first time the user reveals it, that frame uploads and compiles everything at once, which is exactly when the user is watching. Warm it up while nothing is happening: after the first view is on screen, `compileAsync` the hidden parts and `initTexture` their textures.

### Variant switches

A configurator switches a product between finishes. Whether a switch compiles depends on what it changes:

```js
finish.color.set('#1e3a8a'); // numbers the shader reads: no new program
finish.roughness = 0.2;      // the same
mesh.material = clearcoat;   // a MeshPhysicalMaterial: a new program, the first time it's drawn
scene.add(sun);              // one more light: every lit material needs a new program
```

- **Numbers are free:** color, roughness, metalness, and opacity are values the program reads, called uniforms.
- **Anything that changes the program's shape compiles:** a different material type, gaining or losing a map, `flatShading`, fog, or the number of lights.
- **Only the first time.** Each material keeps every program it has used until you dispose it, so switching back and forth compiles once per combination. To avoid even that first stutter, compile each variant's material ahead of time on a stand-in mesh: `await renderer.compileAsync(new Mesh(part.geometry, clearcoat), camera, scene)`.

Try the variants. The readout counts the programs compiled by the render after each switch. Click a variant a second time and it compiles nothing.

<div data-scene="variants"></div>

### Where the time goes

- **Decode** doesn't freeze the page, but it's CPU work, which drains battery on phones. The Draco vs Meshopt page compares the two geometry decoders.
- **Upload** grows with the bytes: textures are usually the biggest part. The runtime memory math page puts numbers on it. GLTFLoader decodes a model's images during the load, but browsers may leave an image from `TextureLoader` undecoded until it's uploaded, which adds the decode to that frame too.
- **Compile** grows with the number of new programs, and with how many features each one has.
- Measuring frame time and finding which frame stalled comes in Loop 2 and the GPU pipeline domain.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
