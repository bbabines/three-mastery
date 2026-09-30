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

> **In short:** A hitch is one frame far over budget, usually the first to show something new, avoided by doing that work early or in pieces.
>
> **Used for:** The first click on a finish option, switching product variants, moving between rooms or pages, and opening a 3D panel.

## A · The basics

### Loading isn't the whole delay

A model's trip to the screen is download, decode, upload, compile. When the load finishes, the last two haven't happened yet: three.js does them in the first frame that draws the model. If that's the frame after a click, it does them all at once, the frame runs far over its budget, and the page freezes for a moment. That's a **hitch**.

### Keep the work out of that frame

There are three ways out. Do it early: `renderer.compileAsync` builds the shaders and `renderer.initTexture` uploads a texture while the parts are still hidden. Spread it out: show twelve new parts over twelve frames instead of in one. Or move it off the main thread: Draco and KTX2 decoding already run in workers.

**Analogy: set changes in a play.** The crew changes the scenery during the intermission, or a piece at a time behind a curtain, never all at once with the audience watching.

Show the twelve hidden finishes with each version of the code, and watch the shaders compiled and textures uploaded in each frame.

<div data-scene="reveal"></div>

## B · Working knowledge

### Warming up while nothing is happening

```js
await renderer.compileAsync(finishes, camera, scene); // shaders, for this scene's lights
for (const texture of finishTextures) renderer.initTexture(texture);
```

Run it after the first view is on screen, or behind a loading screen. Set up the scene's lights and environment first: shaders are built for them, and changing them later compiles again.

### Spreading work across frames

```js
renderer.setAnimationLoop(() => {
  if (queue.length) scene.add(queue.shift()); // one new part a frame
  renderer.render(scene, camera);
});
```

The same goes for big jobs in your own code, like building thousands of instance matrices: split them into chunks, one a frame.

### What stays a hitch

A single huge texture or a very complex shader is one big job that can't be split. Smaller textures and fewer material variants make every step cheaper.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
