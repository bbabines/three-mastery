---
id: 1.gpu.pipeline-stages.read-the-code.1
loop: 1
tier: core
concepts: [gpu.pipeline-stages]
mode: read-the-code
context: gpu.pipeline-stages/vertex-vs-pixel
lenses: []
misconceptions:
  - gpu.pipeline-stages/fragment-is-pixel
---

# Pipeline stages

> **In short:** Every draw call sends its triangles down the same assembly line on the GPU: place the corners on screen, find the pixels each triangle covers, color those pixels, then decide which colors make it into the picture.
>
> **Used for:** Working out whether a slow scene has too many vertices or too many pixels; understanding why see-through objects come out in the wrong order; knowing where the holes in a cutout get made; and reading GPU captures and shader errors, which name the stages.

## A · The basics

### One draw call, start to finish

A **draw call** is one request from three.js to the GPU: draw this geometry with this material (the object types tour defined it). Once the GPU has the request, the triangles go through the same stages, always in this order:

| Stage | What happens | How often it runs | What you set in three.js |
| --- | --- | --- | --- |
| Buffers | The geometry's attributes, already uploaded to GPU memory, are read vertex by vertex | Once per vertex | The geometry |
| Vertex shader | A small program places each vertex: it turns the position into clip space | About once per vertex | The material, or `vertexShader` |
| Clipping and culling | Drops triangles outside the view, trims ones that cross its edge, and drops ones facing away | Once per triangle | The camera, and `material.side` |
| Rasterization | Finds which pixels each triangle covers; each covered pixel becomes a **fragment** | Once per triangle | Nothing: it's fixed |
| Fragment shader | Works out each fragment's color: lighting, textures | Once per fragment | The material, or `fragmentShader` |
| Depth and stencil tests | Throws away fragments behind what's already drawn, or outside a mask | Once per fragment | `depthTest`, `depthWrite`, the stencil settings |
| Blending | Mixes a see-through fragment's color with the color already there | Once per fragment | `transparent`, `opacity`, `blending` |
| Framebuffer | The picture being built: a color, a depth, and a stencil value for every pixel | | The canvas, or a render target |

Clip space is the stop on a point's trip from the clip space, NDC, screen page. The two shaders are the programs three.js builds from your material, the ones the decode, upload, compile page compiles. Everything else is fixed hardware that you switch on, off, or around with settings.

### A fragment is a candidate, not a pixel

A pixel is one dot of the finished picture. A **fragment** is one triangle's claim on one pixel. Where triangles overlap, the same pixel gets a fragment from each of them. Each fragment can run the fragment shader, and then:

- the depth test can throw it away, because something nearer is already there;
- a nearer fragment that comes later can overwrite it;
- the shader itself can throw it away with `discard`, which is how `alphaTest` cuts holes.

Only what survives lands in the pixel. So the fragment shader can run many more times than there are pixels on screen, and that extra work is called **overdraw**.

**Analogy: auditions for a part.** Everyone who shows up gets an audition, and every audition takes the casting team's time, but each part goes to one actor. Pixels are the parts; fragments are the auditions.

The grid is a tiny screen, 24 pixels across. A pixel counts as covered when its center is inside a triangle. Slide the near (blue) triangle over the far (orange) one: where they overlap, each pixel gets two fragments and keeps one.

<div data-scene="raster"></div>

### Two kinds of GPU work

Vertex work grows with the number of vertices. Pixel work grows with the number of fragments: how many pixels the object covers, plus overdraw, times how much the fragment shader does for each. The two are independent. A detailed ball far away can have a hundred thousand vertices and cover a few hundred pixels; a single rectangle across the whole screen has four vertices and covers every pixel.

Change the ball's detail and its size on screen. The readout counts the vertices the vertex shader runs for and the pixels the fragment shader runs for, counted from the frame itself.

<div data-scene="work"></div>

## B · Working knowledge

### Vertex work or pixel work?

```js
new SphereGeometry(1, 256, 128);  // 33,153 vertices, however small it looks
renderer.setPixelRatio(2);         // 4 times the fragments of a pixel ratio of 1
material.fragmentShader = heavier; // more work in every one of those fragments
```

- As a rule of thumb, three.js scenes run out of pixel work (large canvases, high pixel ratios, overdraw, heavy materials) or out of CPU time (too many draw calls) long before they run out of vertex work.
- Vertex work repeats for every render of the mesh: the shadows page's shadow pass runs the casting meshes' vertices again.
- Which one a slow scene is short of is a measurement, not a guess: Loop 3's proof experiments shrink one kind of work at a time and watch the frame time. The frame budget and measurement tools pages come later in this domain.

### Where discard happens

```js
fence.material.alphaTest = 0.5; // fragments whose alpha is under 0.5 are discarded
```

`discard` happens inside the fragment shader, after rasterization has made the fragment and the shader has started on it. A hole in a cutout costs nearly as much as a solid pixel. A shader that can discard can also stop the GPU from skipping hidden fragments early, which the depth buffer and early-z page covers.

### Transparency needs an order

Blending mixes a fragment with whatever color is already in the framebuffer. So a see-through object has to be drawn after the things behind it, or there's nothing there yet to mix with. That's why three.js draws opaque objects first and see-through ones afterwards, back to front: the state changes and sorting page and the blending page cover the rules.

### Reading a symptom by stage

| Symptom | Stage |
| --- | --- |
| A mesh cut open when the camera gets close | Clipping, at the camera's near plane |
| A plane invisible from behind | Culling: set `side: DoubleSide` |
| Jagged edges | Rasterization: the multisampling page |
| A see-through object hides what's behind it | The depth test: the blending page |
| Holes where a texture is transparent | The fragment shader's `discard`, from `alphaTest` |

### Which space is it in?

This page works between **measured from the object itself**, where the vertices start, and **screen pixels**, where fragments land.

| Value | Space |
| --- | --- |
| The `position` attribute the vertex shader reads | Measured from the object itself |
| What the vertex shader outputs, `gl_Position` | Clip space |
| Where rasterization finds covered pixels | Device pixels on the canvas or render target |
| A fragment's depth, for the depth test | NDC z squeezed into 0 to 1, as on the depth precision page |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
