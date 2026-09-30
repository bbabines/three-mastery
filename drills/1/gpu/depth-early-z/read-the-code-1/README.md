---
id: 1.gpu.depth-early-z.read-the-code.1
loop: 1
tier: core
concepts: [gpu.depth-early-z]
mode: read-the-code
context: gpu.depth-early-z/overdraw
lenses: []
misconceptions:
  - gpu.depth-early-z/hidden-free
---

# Depth buffer and early-z

> **In short:** The GPU skips fragments behind the nearest surface drawn so far, but a hidden object still costs its draw call and its vertex work.
>
> **Used for:** Buildings full of hidden rooms, cutout panels and foliage, drawing solid objects front to back, and depth prepasses.

## A · The basics

### The depth test

The **depth buffer** holds, for every pixel, the depth of the nearest surface drawn there so far. Each new fragment is compared with it. A nearer one passes and, if its material writes depth, becomes the new nearest; a farther one is thrown away. That's why solid objects hide each other correctly in any order.

### Throwing fragments away early

GPUs usually also run the depth test before the fragment shader, whenever the shader can't change the result. This is **early-z**: a fragment behind something already drawn is thrown away before any shading is spent on it. It only helps when the nearer surface was drawn first, which is why three.js draws solid objects front to back. A shader that can `discard`, as `alphaTest` adds, or that writes its own depth, as `logarithmicDepthBuffer` does, can switch it off.

**Analogy: painting a wall behind a bookcase.** With the bookcase already in place, you skip the part of the wall it hides. Paint first and move the bookcase in later, and the painting behind it was wasted.

In the overdraw view, each fragment written adds light. Switch between the two draw orders there, then check that the normal view looks the same either way.

<div data-scene="layers"></div>

### Hidden isn't free

Only fragments get this saving. By then, three.js has spent CPU time on the hidden object's draw call, and the GPU has run the vertex shader on all its vertices. three.js skips objects outside the camera's view, but not objects merely behind something.

Toggle the wall: every bin is drawn either way. Then orbit until the shelves leave the view.

<div data-scene="hidden"></div>

## B · Working knowledge

### Depth settings on a material

```js
material.depthTest = true;           // the default: hidden fragments are thrown away
material.depthWrite = true;          // the default: this surface hides what comes after it
material.depthFunc = LessEqualDepth; // the default: nearer or equal passes
```

See-through surfaces often turn `depthWrite` off, and labels turn `depthTest` off to draw over everything.

### Alpha-tested panels

```js
panel.material.alphaTest = 0.5; // a cutout: alpha under 0.5 is discarded
```

A cutout keeps writing depth and needs no sorting, so it's the usual choice for fences, perforated metal, and leaves. The price is the `discard`: a stack of cutout panels can lose early-z and shade every layer at every pixel.

### Depth prepass

A **depth prepass** draws the scene once writing only depth, then again with full shading, so each pixel is shaded about once. It doubles the draw calls and vertex work, so it only pays when fragment shaders are heavy and overdraw is high. three.js has no built-in one; this is its core:

```js
scene.overrideMaterial = new MeshBasicMaterial({ colorWrite: false }); // depth only
renderer.render(scene, camera);
scene.overrideMaterial = null;
renderer.autoClearDepth = false; // keep that depth for the second render
```

Then render again, and set `autoClearDepth` back to `true` afterwards.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
