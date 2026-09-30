---
id: 1.geometry.buffer-attribute.read-the-code.1
loop: 1
tier: core
concepts: [geometry.buffer-attribute]
mode: read-the-code
context: geometry.buffer-attribute/read-vertex
lenses: []
misconceptions:
  - geometry.buffer-attribute/array-index
---

# BufferAttribute and itemSize

> **In short:** A geometry stores each kind of vertex data as one long row of plain numbers, and `itemSize` says how many go with each vertex.
>
> **Used for:** Measuring a model's corners, heat-map colors on a scanned part, extra data for shaders, and shapes built from code.

## A · The basics

### A shape is a list of corners

A **vertex** is one corner point of a shape, along with everything stored about it: where it sits, which way the surface faces there, what color it is. Triangles are drawn between vertices, three at a time. A vertex's position is measured from the object itself, so moving the mesh doesn't change its numbers.

### Every position, in one flat list

three.js doesn't keep a `Vector3` for each vertex. It keeps all the positions in one list of plain numbers: x, y, and z of vertex 0, then x, y, and z of vertex 1, and so on. The list is a `Float32Array`, a **typed array**: a fixed-length list of numbers that are all the same kind, in the format the GPU reads. A **BufferAttribute** wraps that list and adds `itemSize`, how many numbers belong to each vertex.

```js
const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]); // 3 vertices
geometry.setAttribute('position', new BufferAttribute(positions, 3)); // itemSize 3: x, y, z
```

`position` and `normal` have an `itemSize` of 3, and `uv` has 2. `count` is the number of vertices: the list's length divided by `itemSize`.

**Analogy: a weekly pill organizer.** It's one long strip of little boxes, filled three a day: morning, noon, and night. Day 7's pills don't start at box 7; they start at box 21.

Pick a vertex with the slider, then try both buttons. Reading from 3 × the vertex number finds its corner; reading from the vertex number itself lands on numbers from other vertices.

<div data-scene="readVertex"></div>

## B · Working knowledge

### Reading one vertex

```js
const position = geometry.attributes.position;
const corner = new Vector3().fromBufferAttribute(position, 7); // vertex 7
mesh.localToWorld(corner); // now in the world
```

`fromBufferAttribute`, `getX`, and `setXYZ` take the vertex number, not the array index, and they also get interleaved and normalized attributes right, where array math doesn't. The numbers are measured from the object itself, so turn a corner into the world before you compare it with anything else in the scene.

### Writing a color attribute

```js
const colors = new BufferAttribute(new Float32Array(position.count * 3), 3);
geometry.setAttribute('color', colors);
colors.setXYZ(4, hot.r, hot.g, hot.b); // vertex 4, from a Color
material.vertexColors = true;
```

Without `vertexColors: true`, the material ignores the attribute. The numbers run from 0 to 1, not 0 to 255, and once the mesh has been drawn a change also needs `colors.needsUpdate = true`.

Pick a vertex and paint it both ways. Writing to `colors.array[i]` puts the numbers in the wrong slots, so odd colors show up on vertices you never picked.

<div data-scene="paint"></div>

### Building a shape, or adding your own data

```js
geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3));
geometry.computeVertexNormals(); // lighting needs normals
geometry.setAttribute('sway', new BufferAttribute(new Float32Array(position.count), 1)); // your own data
```

`Float32BufferAttribute` copies a plain array for you. Any name works, with an `itemSize` from 1 to 4, and a shader of your own reads it by that name. With an `itemSize` of 1, and only then, the array index is the vertex number.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
