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

> **In short:** Changing a geometry's numbers after its first draw changes nothing on screen until you tell three.js to send them to the GPU again.
>
> **Used for:** Waving flags and water, routes that draw themselves, brush highlights on terrain, and live data streaming in.

## A · The basics

### The GPU keeps its own copy

The first time a mesh is drawn, three.js uploads each attribute's array to GPU memory, and from then on the GPU draws from that copy. Your code only ever touches the copy on the CPU. So after the first draw, editing the array changes nothing on screen until you ask three.js to send it again:

```js
position.setY(i, height);    // changes the CPU copy
position.needsUpdate = true; // adds 1 to position.version; the next render sends the whole array
```

**Analogy: a printed menu.** Changing a price in the restaurant's spreadsheet doesn't change the menus on the tables. Someone has to print them again, and `needsUpdate` is the order to reprint.

### Draw only part of it

`geometry.setDrawRange(start, count)` draws only part of the geometry and leaves the data in place. With an index, `count` counts index numbers, three per triangle; without one, it counts vertices.

The flag waves by editing its positions every frame. Switch between the three buttons, then pull the draw range down.

<div data-scene="wave"></div>

## B · Working knowledge

### After you edit

```js
position.needsUpdate = true;      // the positions changed
geometry.computeVertexNormals();  // the shape changed, so the lighting needs new normals
geometry.computeBoundingSphere(); // so culling and raycasting see the new shape
```

`computeVertexNormals()` marks the normals for upload itself. The index and a `color` attribute update the same way: change the numbers, then set their `needsUpdate`.

### Sending less

`needsUpdate` sends the whole array, which is a lot for a big mesh where a few vertices changed. Mark the part that changed, counted in array numbers, not vertices:

```js
position.setXYZ(i, x, y, z);
position.addUpdateRange(i * 3, 3); // vertex i's three numbers
position.needsUpdate = true;
```

For an attribute you'll change often, `position.setUsage(DynamicDrawUsage)` tells the GPU so. It has to be set before the first draw.

### Growing a buffer

A GPU buffer keeps the size it was made with, and three.js throws an error if you swap in a bigger array. Make the array as big as it will ever need to be, and draw only the part that's filled:

```js
const position = new BufferAttribute(new Float32Array(MAX * 3), 3); // room for MAX points
position.setXYZ(n, x, y, z); // each time a point arrives
position.needsUpdate = true;
geometry.setDrawRange(0, ++n);
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
