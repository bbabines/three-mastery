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

> **In short:** The GPU keeps the nearest depth drawn so far at every pixel and throws away fragments behind it, often before shading them, but an object hidden behind another still costs its draw call and its vertex work.
>
> **Used for:** Working out why a building full of rooms is slow when most of it is out of sight; choosing between `alphaTest` and blending for perforated panels and foliage; knowing why three.js draws solid objects front to back; and deciding whether a depth prepass would pay off.

## A · The basics

### The depth test, fragment by fragment

The depth precision page introduced the **depth buffer**: for every pixel, the depth of the nearest surface drawn there so far. Each new fragment's depth is compared with it. A nearer fragment passes, and if its material writes depth, its depth becomes the new nearest. A farther one is thrown away. That's why solid objects hide each other correctly whatever order they're drawn in.

### Throwing fragments away early

The pipeline stages page put the depth test after the fragment shader. As a rule of thumb, GPUs also run it early, before the shader, whenever the shader can't change the outcome. This is called **early-z**. A fragment behind something already drawn is then thrown away before any shading work is spent on it.

Early-z only saves work when the nearer surface was drawn first; otherwise the hidden fragment is shaded, and then painted over. That's why three.js draws solid objects front to back (the state changes and sorting page). And as a rule of thumb, two things can switch early-z off for a material:

- **`discard` in the fragment shader,** which is what `alphaTest` adds: whether the fragment survives isn't known until the shader has run.
- **Writing depth from the shader,** which `logarithmicDepthBuffer: true` does, as the depth precision page mentioned.

**Analogy: painting a wall behind a bookcase.** If the bookcase is already in place, you skip the part of the wall it hides. If you paint first and move the bookcase in afterwards, the painting behind it was wasted, though the room looks the same. Drawing front to back is moving the bookcase in first; early-z is the painter noticing and skipping.

Five panels stand one behind another. In the **overdraw view**, each fragment that passes the depth test adds a little light, so a pixel's brightness shows how many times it was written. Drawn front to back, the overlaps stay dim: the depth test rejects the hidden layers. Drawn back to front, the overlaps glow: every layer passes and is shaded, then covered. The normal view looks the same either way.

<div data-scene="layers"></div>

### Hidden isn't free

Only the fragments get this saving. Before a single fragment exists, three.js has already spent CPU time on the hidden object's draw call, and the GPU has run the vertex shader on all its vertices. three.js skips objects outside the camera's view (frustum culling), but it has no way to skip objects that are inside the view and merely behind something.

The shelves stand behind a wall. Toggle the wall: every bin is drawn either way, and the counts change only by the wall's own draw call and triangles. Then orbit until the shelves leave the view: now the counts drop.

<div data-scene="hidden"></div>

## B · Working knowledge

### Depth settings on a material

```js
material.depthTest = true;           // the default: hidden fragments are thrown away
material.depthWrite = true;          // the default: this surface hides what comes after it
material.depthFunc = LessEqualDepth; // the default comparison: nearer or equal passes
```

- `depthWrite: false` is for see-through surfaces; the blending page covers why.
- `depthTest: false` draws over everything, like the labels on these pages; pair it with a high `renderOrder` so it's drawn last.

### Alpha-tested panels

```js
panel.material.alphaTest = 0.5; // a cutout: fragments with alpha under 0.5 are discarded
```

A cutout keeps depth writes and needs no sorting, which makes it the usual choice for chain-link fences, perforated metal, and leaves. The price is the `discard`: a stack of cutout panels can lose early-z and shade every layer at every pixel. When a scene of layered cutouts is slow, that's the first suspect, and the overdraw reduction page in the optimization domain covers what to do.

### Depth prepass

A **depth prepass** draws the scene once writing only depth, then again with full shading. In the second draw every hidden fragment fails the depth test, so each pixel is shaded about once. It costs a second set of draw calls and vertex work, so it only pays when the fragment shaders are heavy and the overdraw is high. three.js has no built-in prepass; one way to build it:

```js
scene.overrideMaterial = new MeshBasicMaterial({ colorWrite: false }); // depth only
renderer.render(scene, camera);
scene.overrideMaterial = null;
renderer.autoClearDepth = false; // keep the depth from the first draw
renderer.render(scene, camera);
renderer.autoClearDepth = true;
```

### Which space is it in?

| Value | Space |
| --- | --- |
| The depth buffer's value at a pixel | NDC z squeezed into 0 to 1, as on the depth precision page |
| "Front to back" in three.js's sort | Each object's bounding-sphere center, along the way the camera faces |
| What frustum culling tests | Each object's bounding sphere in the world, against the camera's view |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
