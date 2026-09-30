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

> **In short:** Loading only builds a model in JavaScript memory; uploading it to the GPU and compiling its shaders wait for the first frame that draws it.
>
> **Used for:** Opening finish options without a freeze, switching variants smoothly, warming up behind a loading screen, and first-use stutters.

## A · The basics

### Four costs, not one

A model goes through four steps between the server and the screen. **Download** brings the bytes. **Decode** unpacks them into arrays and pixels, during the load and mostly off the main thread. **Upload** copies those into GPU memory, and **compile** builds a shader program for each new kind of material. File size only predicts the download. The last two wait for the first render that draws the model, and the page can't respond until they finish.

**Analogy: a kitchen adding a new dish.** The ingredients are delivered and unpacked, but they still have to be stocked on the line, and the cooks have to learn the recipe. If that happens when the first order comes in, that customer waits.

### What a shader program is

A **shader** is a small program the GPU runs to draw a material. three.js writes it from the material's settings, like its type, its maps, the number of lights, and fog, and the GPU's driver compiles it. Materials with matching settings share one program, so the rack model's materials need only two: one with a color map and one without.

### Doing the work early

`renderer.compileAsync` compiles a model's shaders before it's shown, and `renderer.initTexture` uploads a texture early. Geometry has no separate call; it uploads on the first render that draws it.

Step through a warm-up of the rack model, then compare the last two buttons: the first render with the warm-up and without it.

<div data-scene="warmUp"></div>

## B · Working knowledge

### Warming up a model before it's shown

```js
await renderer.compileAsync(gltf.scene, camera, scene); // shaders only
for (const texture of textures) renderer.initTexture(texture); // each map the model uses
scene.add(gltf.scene); // the first render still uploads the geometry
```

The third argument is the scene the model will join. Set up its lights and `scene.environment` first, because they're part of every lit material's program. Where the browser can compile in the background, `compileAsync` waits without freezing the page, so prefer it to `renderer.compile`.

### The first-interaction hitch

A model that's loaded but hidden, like a finish panel or the next room of a tour, costs the GPU nothing yet. The first time it's revealed, that frame uploads and compiles everything at once, just as the user is watching. Warm it up while nothing else is happening, after the first view is on screen.

### Variant switches

```js
finish.color.set('#1e3a8a'); // a number the shader reads: no new program
mesh.material = clearcoat;   // a new material type: compiles on first draw
scene.add(sun);              // one more light: every lit material compiles again
```

Color, roughness, and opacity are **uniforms**, values the program reads, so changing them is free. A new material type, a new map, `flatShading`, fog, or a different number of lights changes the program itself. Each combination compiles only the first time; switching back reuses its program. To skip even that first stutter, compile a variant's material ahead of time on a stand-in mesh:

```js
await renderer.compileAsync(new Mesh(part.geometry, clearcoat), camera, scene);
```

Try the variants, then click one a second time.

<div data-scene="variants"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
