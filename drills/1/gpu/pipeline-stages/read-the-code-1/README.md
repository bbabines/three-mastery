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

> **In short:** Every draw call takes the same trip through the GPU: place the corners, find the covered pixels, color them, and decide which colors land.
>
> **Used for:** Telling vertex cost from pixel cost, ordering see-through objects, cutting holes in cutouts, and reading GPU captures.

## A · The basics

### One draw call, start to finish

A **draw call** is one request to the GPU: draw this geometry with this material. The GPU then runs the same steps, always in this order. The **vertex shader**, a small program three.js builds from your material, runs once for each vertex and says where it lands. Triangles outside the view, or facing away, are dropped. **Rasterization** finds the pixels each triangle covers. The **fragment shader** works out a color for each of them. Last, the depth test and blending decide what reaches the picture.

Only the two shaders are programs. Everything else is fixed hardware that you switch on, off, or around with settings like `side`, `depthTest`, and `transparent`.

### A fragment is a candidate, not a pixel

A pixel is one dot of the finished picture. A **fragment** is one triangle's claim on one pixel. Where triangles overlap, the pixel gets a fragment from each, and each can be shaded, then thrown away by the depth test or covered by a nearer one. So the fragment shader can run more times than there are pixels, and that extra work is called **overdraw**.

**Analogy: auditions for a part.** Everyone who shows up gets an audition, and each one takes the casting team's time, but only one actor gets the part. Pixels are the parts; fragments are the auditions.

Slide the near triangle over the far one. Where they overlap, each pixel gets two fragments and keeps one.

<div data-scene="raster"></div>

### Two kinds of GPU work

**GPU vertex work** grows with the number of vertices. **GPU work for every pixel** grows with the pixels an object covers, plus overdraw, times what its fragment shader does. The two are independent: a detailed ball far away has many vertices and few pixels, and a rectangle across the screen has four vertices and every pixel.

Change the ball's detail and its size on screen, and watch each count.

<div data-scene="work"></div>

## B · Working knowledge

### Vertex work or pixel work?

```js
new SphereGeometry(1, 256, 128);  // 33,153 vertices, however small it looks
renderer.setPixelRatio(2);         // 4 times the fragments of a ratio of 1
material.fragmentShader = heavier; // more work in every one of them
```

three.js scenes usually run out of pixel work or CPU time long before vertex work. Vertex work repeats for every render of a mesh, so a shadow pass runs the casters' vertices again. Which one a slow scene is short of is a measurement, not a guess.

### Where discard happens

```js
fence.material.alphaTest = 0.5; // fragments under 0.5 alpha are discarded
```

`discard` runs inside the fragment shader, after the fragment was made and shading began. So a hole in a cutout costs nearly as much as a solid pixel, and it can stop the GPU skipping hidden fragments early, as the depth buffer and early-z page shows.

### Drawing see-through objects last

Blending mixes a fragment with the color already in the picture, so a see-through object must be drawn after what's behind it. That's why three.js draws solid objects first, then see-through ones back to front.

### Which space is it in?

This page works between **measured from the object itself**, where vertices start, and **device pixels**, where fragments land.

| Value | Space |
| --- | --- |
| `position`, read by the vertex shader | Measured from the object itself |
| `gl_Position`, the vertex shader's output | Clip space |
| Where rasterization finds covered pixels | Device pixels |
| A fragment's depth | NDC z squeezed into 0 to 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
