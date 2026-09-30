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

> **In short:** Every material is two small GPU programs: one moves each corner of the mesh into place, and one paints everything the triangles cover.
>
> **Used for:** Rippling flags and water, painted stripes and glows, selection highlights, and finding where a slow scene spends GPU time.

## A · The basics

### Two small programs

A **shader** is a small program that runs on the GPU. Every material three.js draws is two of them:

- The **vertex shader** runs once for each vertex and says where it lands, by setting `gl_Position`.
- The **fragment shader** runs once for each fragment, a triangle's claim on one pixel, and says its color, by setting `gl_FragColor`.

With a `ShaderMaterial`, you write both yourself, in **GLSL**, the language WebGL shaders are written in. The vertex shader runs `position` through three.js's matrices, which the built-in matrices page covers; the fragment shader paints orange, then converts the color for the screen, the way three.js's own materials do:

```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // vertex shader
gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);                               // fragment shader: orange
#include <colorspace_fragment>                                         // always last
```

**Analogy: pins and paint.** One person pushes a pin in at each corner of a shape, then a crew paints every square the shape covers. The shape sets the number of pins; how big it looks sets the number of squares.

Lower the detail. The wave turns into a few straight folds, because the vertex shader only runs at the corners, but the stripes stay sharp.

<div data-scene="flag"></div>

### A fragment isn't a pixel

The fragment shader runs once per fragment, not once per pixel. Where triangles overlap, one pixel gets a fragment from each of them, and each can run the shader, though the screen keeps only one color. That extra work is **overdraw**.

Add panes, then switch to the run-count view: the brighter a spot, the more times the fragment shader ran there.

<div data-scene="overdraw"></div>

## B · Working knowledge

### Where each effect goes

The vertex shader can move vertices but can't add any, so a wave or a bulge needs enough of them to show. The fragment shader can't move the surface; it only colors what the triangles cover, so stripes, glows, and textures go there.

```js
new PlaneGeometry(3, 2);        // 4 vertices: a wave can only tip it
new PlaneGeometry(3, 2, 64, 1); // 130 vertices: enough for a ripple
```

### What three.js declares for you

A `ShaderMaterial` declares `position`, `normal`, `uv`, and the matrices above your code, but it doesn't apply the matrices: that's your `gl_Position` line. The attributes are declared only in the vertex shader.

```js
new ShaderMaterial({ vertexShader, fragmentShader });    // attributes and matrices declared for you
new RawShaderMaterial({ vertexShader, fragmentShader }); // you declare every one yourself
```

### What each one costs

```js
new PlaneGeometry(4, 4, 64, 64);                       // 4,225 vertices: 4,225 vertex shader runs per draw
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // at 2, four times the fragments of 1
```

Vertex work grows with the vertex count and repeats in every pass that draws the mesh, shadows included. Fragment work grows with the pixels covered, times overdraw, times the pixel ratio squared, and it's usually most of a scene's GPU time.

### Which space is it in?

| Value | Space |
| --- | --- |
| `position` in the vertex shader | Measured from the object itself |
| `gl_Position` | Clip space |
| The pixel a fragment lands on | Device pixels on the canvas |
| `gl_FragColor` | No space: a color, each part 0 to 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
