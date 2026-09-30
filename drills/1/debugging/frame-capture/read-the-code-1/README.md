---
id: 1.debugging.frame-capture.read-the-code.1
loop: 1
tier: core
concepts: [debugging.frame-capture]
mode: read-the-code
context: debugging.frame-capture/double-rendering
lenses: []
misconceptions:
  - debugging.frame-capture/scene-graph-truth
---

# Frame capture

> **In short:** A capture shows what one frame really drew, draw call by draw call, instead of what the scene graph says it should.
>
> **Used for:** Catching a frame drawn twice, checking which texture was used, looking inside render targets, and reading built shaders.

## A · The basics

### The scene graph is the plan, not the frame

The **scene graph**, your objects and their parents, says what should be drawn. What the GPU draws is decided by the commands three.js sends while it renders, and the two can differ. Shadows draw every shadow-casting mesh again, from the light. A second `renderer.render` call in the same frame draws the whole scene again. A draw call can sample a different texture than the one you meant.

A **frame capture** records those commands for one whole frame: each `useProgram`, uniform, `bindTexture`, and draw call, with the state behind it.

**Analogy: a recipe and a kitchen camera.** The recipe says two eggs; the camera shows three went in. The scene graph is the recipe, and a capture is the footage.

Compare the scene graph with the draw calls one frame really makes, with shadows on and with `render()` called twice.

<div data-scene="drawList"></div>

### Step through a frame

A capture also keeps the picture after each draw call, so you can watch the frame being built one draw at a time. That's how you find which draw put the wrong thing on screen, or what a render target held before it was used. Move the slider to stop the frame after each draw in turn.

<div data-scene="stepThrough"></div>

## B · Working knowledge

### Capturing with Spector.js

**Spector.js** is the usual capture tool for WebGL, as a browser extension or as the `spectorjs` package. With the extension, open your page, click its toolbar icon (which reloads the page), then click the red capture button to record one frame. Pick a draw call to see its state, its textures as pictures, its uniforms, its shader source, and the picture after it.

```js
const spector = new SPECTOR.Spector(); // from the spectorjs package
spector.displayUI();                   // the same capture tool, inside your page
```

### Name your materials

three.js writes `#define SHADER_NAME` with the material's `name` near the top of every shader it builds, so named materials are easy to spot in a capture's shader view:

```js
material.name = 'crate';
```

### What only a capture shows

Double rendering shows as the list of draws repeating within one frame, often from calling `renderer.render` both in the animation loop and in a controls `change` handler. `renderer.info` doesn't catch it, since it counts only the last `render()` call. A draw's textures show exactly what its shader sampled, whatever the material says. And a draw into a render target shows that target's picture after it, so you can check a shadow map or a post-processing buffer partway through the frame.

### Capture, then measure

A capture shows what a frame does, not how long it takes, and it slows the page while it runs. Time frames with Chrome's Performance panel instead.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
