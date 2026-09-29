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

> **In short:** A geometry keeps each kind of per-vertex data, like every corner's position, in one long flat list of numbers, and `itemSize` says how many of those numbers belong to each corner.
>
> **Used for:** Finding where a model's corners are, to measure or snap to them; coloring a scanned part corner by corner, like a heat map; handing a shader extra data for each corner, like how much each blade of grass sways; and building shapes from code, like a terrain or a 3D chart.

## A · The basics

### A shape is a list of corners

A **vertex** is one corner point of a shape, along with everything stored about it: where it sits, which way the surface faces there, what color it is. Triangles are drawn between vertices, three at a time. A single triangle has 3 vertices, a flat square has 4, and a box built by three.js has 24 (the indexed vs non-indexed page explains why not 8).

A vertex's position is measured from the object itself, like the input to `localToWorld` on the local vs world space page. Move the mesh and the numbers stay the same.

### Every position, in one flat list

three.js doesn't keep a `Vector3` for each vertex. It keeps all the positions in one long list of plain numbers: x, y, and z of vertex 0, then x, y, and z of vertex 1, and so on. The list is a `Float32Array`, a **typed array**: a fixed-length list of numbers that are all the same kind, here decimals stored in 4 bytes each. It's the format the GPU reads directly, so three.js can hand it over as it is.

A **BufferAttribute** wraps that list and adds the rule for reading it: `itemSize`, how many numbers belong to each vertex.

```js
const positions = new Float32Array([
  0, 0, 0, // vertex 0
  1, 0, 0, // vertex 1
  0, 1, 0, // vertex 2
]);
geometry.setAttribute('position', new BufferAttribute(positions, 3)); // itemSize 3: x, y, z
```

Each kind of data is its own attribute with its own itemSize: `position` and `normal` have 3, `uv` has 2 (the UVs page), and `color` has 3, or 4 with transparency. `count` is the number of vertices: the list's length divided by `itemSize`, so 9 ÷ 3 = 3 here.

**Analogy: a weekly pill organizer.** It's one long strip of little boxes, filled three at a time: morning, noon, and night. Day 7's pills don't start at box 7; they start at box 21. `itemSize` is how many boxes make one day.

Pick a vertex with the slider. The right code finds its three numbers at 3 × the vertex number. The wrong code starts at the vertex number itself and lands on numbers from other vertices, often a spot that isn't a corner at all.

<div data-scene="readVertex"></div>

## B · Working knowledge

### Reading one vertex

```js
const position = geometry.attributes.position;
const corner = new Vector3().fromBufferAttribute(position, 7); // vertex 7
const x = position.getX(7);                                     // just its x
```

- Let three.js do the index math. `fromBufferAttribute`, `getX`, `getY`, `getZ`, and `setXYZ` all take the vertex number, not the array index.
- They also get two cases right that array math gets wrong: attributes with `normalized: true`, which store small whole numbers that stand for 0 to 1, and interleaved attributes, where several attributes share one list (the interleaved attributes page).
- `position.count` is the number of vertices. `position.array.length` is the number of numbers.

### Reading it in the world

The numbers are measured from the object itself, so a corner you read hasn't moved, turned, or grown with the mesh. Turn it into the world before you compare it with anything else in the scene:

```js
mesh.localToWorld(corner); // now in the world; it changes corner itself
```

### Building a shape from code

```js
const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3));
geometry.computeVertexNormals(); // lighting needs normals, the vertex normals page
```

`Float32BufferAttribute` copies a plain array into a `Float32Array` for you. For a list of `Vector3`s, `new BufferGeometry().setFromPoints(points)` builds the position attribute.

### Writing a color attribute

Give every vertex a color, then tell the material to use them:

```js
const colors = new BufferAttribute(new Float32Array(position.count * 3), 3);
geometry.setAttribute('color', colors);
const hot = new Color('orange');
colors.setXYZ(4, hot.r, hot.g, hot.b); // vertex 4
material.vertexColors = true;
```

- Without `vertexColors: true`, the material ignores the attribute.
- The numbers run from 0 to 1, not 0 to 255. Filling them from a `Color` gives the values three.js expects.
- Once the mesh has been drawn, changing the numbers needs one more line, `colors.needsUpdate = true`. The updating buffers page covers it.

Pick a vertex and paint it both ways. `setXYZ` paints the vertex you picked. Writing to `colors.array[i]` puts the three numbers into the wrong slots: part of one vertex's color and part of the next, so odd colors show up on vertices you never picked.

<div data-scene="paint"></div>

### Custom per-vertex data

Any name works, with any itemSize from 1 to 4. A shader of your own reads it by that name:

```js
geometry.setAttribute('sway', new BufferAttribute(new Float32Array(position.count), 1));
```

With `itemSize` 1, and only then, the array index is the vertex number. Reading attributes in a shader is the attributes, uniforms, varyings page in the shaders domain.

### What it costs

Every number is kept on the CPU and uploaded to GPU memory. A 32-bit float is 4 bytes, so position (3), normal (3), and UV (2) cost 32 bytes per vertex. A model with 100,000 vertices is about 3.2 MB for those three, before its index.

### Which space is it in?

| Value | Space |
| --- | --- |
| The numbers in `geometry.attributes.position` | Measured from the object itself |
| `new Vector3().fromBufferAttribute(position, i)` | Measured from the object itself |
| That vector after `mesh.localToWorld(v)` | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
