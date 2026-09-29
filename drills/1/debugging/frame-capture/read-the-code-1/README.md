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

> **In short:** A frame capture records every WebGL command one frame sends to the GPU, in order, with the state, textures, and shaders behind each draw call, so you see what was really drawn instead of what the scene graph says should be.
>
> **Used for:** Finding out why a frame draws everything twice; checking which texture a draw call really used; seeing what an offscreen render target holds partway through a frame; and reading the final shader source three.js built for a material.

## A · The basics

### The scene graph is the plan, not the frame

The **scene graph**, your objects and their parents, says what should be drawn. What the GPU draws is decided by the commands three.js sends while it renders, and the two can differ in ways the scene graph never shows:

- Shadows draw every shadow-casting mesh again, from the light.
- A second `renderer.render` call in the same frame draws the whole scene again.
- A render target is drawn into and never shown, or shown with the wrong contents.
- A draw call samples a different texture than the one you meant.

A **frame capture** records the commands themselves: the draw call anatomy page's `useProgram`, uniforms, `bindTexture`, and `drawElements`, for one whole frame.

**Analogy: a recipe and a kitchen camera.** The recipe says two eggs. The camera shows three went in, one of them twice. The scene graph is the recipe; a capture is the camera footage.

The scenes on this page don't run a capture tool. They count WebGL commands the same way one does, by wrapping the WebGL context's methods, and show the part of a capture that matters. Compare the scene graph with the draw calls one frame really makes.

<div data-scene="drawList"></div>

### Step through a frame

A capture also keeps the picture after each draw call, so you can step through the frame being built, one draw at a time. That's how you find which draw put the wrong thing on screen, or what a render target held before it was used. The slider stops the frame after each draw in turn.

<div data-scene="stepThrough"></div>

## B · Working knowledge

### Capturing with Spector.js

**Spector.js** is the usual capture tool for WebGL, from the Babylon.js team. It comes as a browser extension for Chrome and Firefox, or as the `spectorjs` package to add to a page:

1. Install the extension, open your page, and click its toolbar icon. Enabling it reloads the page.
2. Click the red capture button. It records one frame.
3. The result lists every command, grouped by draw call. Pick one to see the state at that moment (depth test, blending, which faces are culled), its bound textures as pictures, its uniforms, the shader source, and the picture after it.

```js
const spector = new SPECTOR.Spector(); // from the spectorjs package
spector.displayUI();                   // the same capture tool, inside your page
```

three.js writes `#define SHADER_TYPE` (the material's type) and `#define SHADER_NAME` (its `name`) near the top of every shader it builds, so give materials names: `material.name = 'crate'` makes its draws easy to spot in the shader view.

### What only a capture shows

- **Double rendering:** the list of draws repeats within one frame. A common cause is calling `renderer.render` both in the animation loop and in a resize or controls `change` handler, or after `composer.render()`. `renderer.info` doesn't catch it: it counts only the last `render()` call, as the draw call anatomy page showed.
- **Wrong texture bound:** pick the draw and look at its textures. The picture shows exactly what the shader sampled, whatever the material says.
- **Render target contents:** a draw into a render target shows that target's picture after it, so you can check a shadow map, a thumbnail, or a post-processing buffer partway through the frame (the render targets page).

### Capture, then measure

A capture shows what a frame does, not how long it takes, and it slows the page while it runs. Chrome's Performance panel times frames; the measurement tools page, in the GPU pipeline domain, covers timing. Remove helpers first, as the helpers page said: they're draw calls too.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
