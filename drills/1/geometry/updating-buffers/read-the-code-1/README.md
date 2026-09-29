---
id: 1.geometry.updating-buffers.read-the-code.1
loop: 1
tier: light
concepts: [geometry.updating-buffers]
mode: read-the-code
context: geometry.updating-buffers/deform
lenses: []
misconceptions:
  - geometry.updating-buffers/array-updates-gpu
---

# Updating buffers

> **In short:** Once a mesh has been drawn, the GPU draws from its own copy of the geometry's data, so after you edit an attribute you set `needsUpdate = true` to send it again; `setDrawRange` limits how much of the geometry is drawn.
>
> **Used for:** Flags, water, and cloth that change shape every frame; drawing a route or a chart line a little further each frame; highlighting the vertices under a brush on a terrain; and live data, like a scan streaming in point by point.

## A · The basics

### The GPU keeps its own copy

The first time a mesh is drawn, three.js uploads each attribute's array into the GPU's memory, and from then on the GPU draws from that copy. Your code only ever touches the copy on the CPU. So after the first draw, editing the array, with `setY` or by hand, changes nothing on screen until you ask three.js to send it again:

```js
position.setY(i, height); // changes the CPU copy
position.needsUpdate = true; // on the next render, three.js sends the whole array again
```

`needsUpdate = true` doesn't upload anything by itself. It adds 1 to the attribute's `version`, and the next render sees the new version and sends the array.

**Analogy: a printed menu.** Changing a price in the restaurant's spreadsheet doesn't change the menus on the tables. Someone has to print them again. `needsUpdate` is the order to reprint.

### Draw only part of it

`geometry.setDrawRange(start, count)` draws only part of the geometry, leaving the data in place. With an index, `count` counts index numbers, three per triangle; without one, it counts vertices.

The flag waves by editing its positions every frame. Switch between the three buttons, then pull the draw range down.

<div data-scene="wave"></div>

## B · Working knowledge

### After you edit

```js
position.needsUpdate = true;       // the positions changed
geometry.computeVertexNormals();   // the shape changed, so the lighting needs new normals
geometry.computeBoundingSphere();  // so culling and raycasting see the new shape
```

- `computeVertexNormals()` sets `needsUpdate` on the normals itself (the vertex normals page). Skip it and the lighting stays as it was for the old shape.
- The bounds don't follow edits (the bounding box and sphere page).
- The index is an attribute too: after editing it, set `geometry.index.needsUpdate = true`.

### Sending less

`needsUpdate` sends the whole array, which is a lot for a big mesh where only a few vertices changed. Mark the part that changed, counted in numbers in the array, not in vertices:

```js
position.setXYZ(i, x, y, z);
position.addUpdateRange(i * 3, 3); // vertex i's three numbers
position.needsUpdate = true;
```

For an attribute you'll change often, `position.setUsage(DynamicDrawUsage)` tells the GPU so. It has to be set before the first draw, because that's when the GPU buffer is made.

### Growing a buffer

A GPU buffer keeps the size it was made with. Swap a bigger array into the same attribute and set `needsUpdate`, and three.js throws an error on the next render. Make the array as big as it will ever need to be, and use the draw range to show only the part that's filled:

```js
const MAX = 10000;
const position = new BufferAttribute(new Float32Array(MAX * 3), 3);
geometry.setAttribute('position', position);
geometry.setDrawRange(0, 0); // nothing yet
// each time a point arrives:
position.setXYZ(n, x, y, z);
position.needsUpdate = true;
geometry.setDrawRange(0, ++n);
```

That's also how to draw a path or a chart line a little further each frame. Raycasting honors the draw range too, so hidden parts can't be clicked.

### Highlighting vertices

A `color` attribute with `vertexColors: true` (the BufferAttribute and itemSize page) updates the same way: change the colors under the brush, then set `colors.needsUpdate = true`.

### What it costs

Every `needsUpdate` is an upload from the CPU to the GPU, and without an update range it's the whole array. Recomputing normals and bounds is CPU time for every triangle. For a mesh that changes every frame, that's paid every frame; many engines move that kind of motion into the vertex shader instead, which the shaders domain covers.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
