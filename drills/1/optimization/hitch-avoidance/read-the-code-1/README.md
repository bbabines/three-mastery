---
id: 1.optimization.hitch-avoidance.read-the-code.1
loop: 1
tier: light
concepts: [optimization.hitch-avoidance]
mode: read-the-code
context: optimization.hitch-avoidance/variant-switch
lenses: []
misconceptions:
  - optimization.hitch-avoidance/load-only-delay
---

# Hitch avoidance

> **In short:** A hitch is one frame that takes far longer than the rest, usually because something is shown for the first time, and it's avoided by compiling and uploading early, spreading big jobs over several frames, and decoding in workers.
>
> **Used for:** The first click on a configurator's finish options; switching a product to another variant; moving between pages or rooms of a web app; and opening a menu or panel with a 3D model in it.

## A · The basics

### Loading isn't the whole delay

The decode, upload, compile page followed a model from file to screen: download, decode, upload, compile. When the load finishes, the last two haven't happened yet. three.js does them in the first frame that draws the model, so if that's the frame after a click, it does all of them at once. That frame runs far over its budget (the frame budget page) and the page freezes for a moment, in the middle of smooth frames. That's a **hitch**.

### Keep the work out of that frame

- **Do it early.** `renderer.compileAsync` builds the shaders and `renderer.initTexture` uploads a texture while the parts are still hidden (the decode, upload, compile page).
- **Spread it out.** Show twelve new parts over twelve frames instead of in one, so each frame does a little.
- **Move it off the main thread.** Draco and KTX2 decoding already run in workers, and GLTFLoader loads images with `createImageBitmap`, which lets the browser decode them without holding up the main thread.

**Analogy: set changes in a play.** The crew changes the scenery during the intermission, or a piece at a time behind a curtain, never all at once in the middle of a scene with the audience watching.

Twelve finishes, each a new kind of material with its own texture, wait hidden. Show them with each version of the code. The readout counts the shaders compiled and textures uploaded in each frame. The finishes share one geometry, already on screen in the ball at the front, so no geometry uploads get in the count.

<div data-scene="reveal"></div>

## B · Working knowledge

### Warming up while nothing is happening

```js
await renderer.compileAsync(finishes, camera, scene); // shaders, for this scene's lights
for (const texture of finishTextures) renderer.initTexture(texture);
```

- Run it after the first view is on screen, while the user reads, or behind a loading screen when a route opens.
- Set up the scene's lights and environment first: shaders are built for them, and changing them later compiles again.

### Spreading work across frames

```js
const queue = [...newParts];
renderer.setAnimationLoop(() => {
  const part = queue.shift();
  if (part) scene.add(part); // one a frame
  renderer.render(scene, camera);
});
```

The same goes for any big job in your own code, like building 5,000 instance matrices or merging geometries: split it into chunks, one per frame.

### What stays a hitch

A texture from `TextureLoader` may still be decoded at upload time, and a single huge texture or a very complex shader is one big job that can't be split. Smaller textures and fewer material variants make every one of these steps cheaper (the texture budget page).

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
