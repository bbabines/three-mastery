---
id: 1.shaders.vertex-vs-fragment.read-the-code.1
loop: 1
tier: core
concepts: [shaders.vertex-vs-fragment]
mode: read-the-code
context: shaders.vertex-vs-fragment/displacement
lenses: []
misconceptions:
  - shaders.vertex-vs-fragment/once-per-pixel
---

# Vertex vs fragment

> **In short:** Every material is two small programs on the GPU: the vertex shader runs for each corner of the mesh and decides where it lands on screen, and the fragment shader runs for each pixel-sized piece the triangles cover and decides its color.
>
> **Used for:** A flag or a water surface that ripples; stripes, gradients, and glows painted onto a product; a selection effect that makes one part stand out; and working out whether a slow scene is spending its GPU time on corners or on pixels.

## A · The basics

### Two small programs

A **shader** is a small program that runs on the GPU. The pipeline stages page showed the assembly line every draw call goes through. Two of its stages are programs rather than fixed hardware, and every material three.js draws, built-in or your own, is those two programs:

- The **vertex shader** runs once for each vertex. Its one job is to say where that vertex lands, by setting `gl_Position`.
- The **fragment shader** runs once for each fragment, a triangle's claim on one pixel. Its job is to say what color that fragment is, by setting `gl_FragColor`.

With a `ShaderMaterial`, you write both yourself, in **GLSL**, the language WebGL shaders are written in:

```js
const material = new ShaderMaterial({
  vertexShader: /* glsl */ `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    void main() {
      gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // red, green, blue, alpha, each 0 to 1
      #include <colorspace_fragment>
    }`,
});
```

That vertex shader is the line almost every vertex shader ends with: it runs the vertex's `position` through the matrices to clip space, the stop from the clip space, NDC, screen page. The built-in matrices page covers each matrix. `#include <colorspace_fragment>` goes last in the fragment shader: it converts the color for the screen, the way three.js's own materials do.

**Analogy: pins and paint.** One person pushes a pin into a board wherever a shape has a corner; then a crew paints every square the shape covers. The number of pins is set by the shape. The number of squares depends on how big the shape looks.

The flag's vertex shader lifts each vertex into a wave, and its fragment shader paints the stripes. Lower the detail: the wave turns into a few straight folds, because the vertex shader only runs at the corners and each triangle stays flat between them. The stripes stay sharp at any detail, because the fragment shader runs at every pixel.

<div data-scene="flag"></div>

### A fragment isn't a pixel

The fragment shader runs once per fragment, not once per pixel. Where triangles overlap, the same pixel gets a fragment from each of them, and each one can run the shader, even though the screen keeps only one color. The pipeline stages page called that **overdraw**.

The panes below are see-through, so every layer is shaded and mixed into the picture. Switch to the run-count view: there, every fragment adds the same small amount of light, so the brighter a spot, the more times the fragment shader ran for it.

<div data-scene="overdraw"></div>

## B · Working knowledge

### What three.js adds to a ShaderMaterial

three.js compiles a `ShaderMaterial` as GLSL ES 3.00 (it adds `#version 300 es`) and puts lines above your code:

- declarations of the attributes `position`, `normal`, and `uv`, and of the matrices, so you use them without declaring them;
- `precision highp float`, the renderer's default precision, which the types and precision page covers;
- lines that keep older names working: `attribute`, `varying`, `gl_FragColor`, and `texture2D`.

`RawShaderMaterial` adds none of that: you declare everything yourself.

### What each shader can and can't do

- The vertex shader can move vertices, but it can't add any, and it can't color the pixels between them.
- The fragment shader can't move the surface. It only colors the fragments the triangles already cover, or throws one away with `discard` (the branching and discard page).
- Neither sees its neighbors: each run gets one vertex or one fragment and nothing else. Handing values from one shader to the other is the attributes, uniforms, varyings page.

So a wave, a bulge, or wind sway goes in the vertex shader, and needs enough vertices to show. A stripe, a glow, or a texture goes in the fragment shader.

### What each one costs

```js
new PlaneGeometry(4, 4, 64, 64);                       // 4,225 vertices: about 4,225 vertex shader runs per draw
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // at 2, four times the fragments of 1
```

- Vertex work grows with the vertex count, and repeats in every pass that draws the mesh. A shadow pass draws it again; the extending materials page covers what that means for a vertex you moved.
- Fragment work is GPU work for every pixel: the pixels an object covers, times overdraw, times the pixel ratio squared. An effect that covers a 1920 × 1080 canvas (in CSS pixels) at pixel ratio 2 runs its fragment shader about 8.3 million times a frame. As a rule of thumb, that's where most of a scene's GPU time goes.

### Which space is it in?

This page works between **measured from the object itself**, where a vertex starts, and the canvas's **device pixels**, where a fragment lands.

| Value | Space |
| --- | --- |
| `position` in the vertex shader | Measured from the object itself |
| `gl_Position`, what the vertex shader hands back | Clip space |
| The pixel a fragment belongs to | Device pixels on the canvas (the fragment coordinates page) |
| `gl_FragColor` | No space: a color, with red, green, blue, and alpha from 0 to 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
