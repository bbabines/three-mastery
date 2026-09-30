---
id: 1.geometry.interleaved.read-the-code.1
loop: 1
tier: light
concepts: [geometry.interleaved]
mode: read-the-code
context: geometry.interleaved/manual-edits
lenses: []
misconceptions:
  - geometry.interleaved/own-array
---

# Interleaved attributes

> **In short:** One list holds the position, UV, and more for vertex 0, then all of it again for vertex 1, and so on.
>
> **Used for:** Reading loaded glTF models, editing their vertices safely, and layouts that keep each vertex's data together in memory.

## A · The basics

### One list for several attributes

On the BufferAttribute and itemSize page, every attribute had its own list. An **interleaved** buffer puts several in one list, a vertex at a time: x, y, z, u, v for vertex 0, then x, y, z, u, v for vertex 1. Two numbers tell each attribute where its data is. The **stride** is how many numbers each vertex takes in the shared list, 5 here. The **offset** is where this attribute's numbers start inside each vertex: 0 for position, 3 for UV.

```js
const data = new InterleavedBuffer(new Float32Array(numbers), 5);         // stride 5: x y z u v
geometry.setAttribute('position', new InterleavedBufferAttribute(data, 3, 0)); // itemSize 3, offset 0
geometry.setAttribute('uv', new InterleavedBufferAttribute(data, 2, 3));       // itemSize 2, offset 3
```

Vertex i's numbers start at i × stride + offset. `itemSize` still says how many numbers the attribute takes; it just isn't the step from one vertex to the next anymore.

**Analogy: a spreadsheet saved two ways.** Put each vertex on a row, with columns x, y, z, u, v. Separate attributes save each group of columns as its own file; interleaved saves the whole sheet row by row, and the stride is how wide a row is.

The panel below is interleaved. Lift a vertex both ways: `setY` moves the corner, but `i * 3 + 1` lands on a different number, often a UV, so the picture slides instead.

<div data-scene="lift"></div>

## B · Working knowledge

### Telling whether an attribute is interleaved

```js
const position = geometry.attributes.position;
position.isInterleavedBufferAttribute; // true when it shares a buffer
position.data.stride;                  // numbers per vertex, for all the shared attributes
position.offset;                       // where position starts inside each vertex
```

`position.array` is the whole shared list, UVs and all, so code that walks it with `i * 3` reads the wrong numbers. `getX`, `setXYZ`, and `fromBufferAttribute` handle the stride and offset, so use them in any code that reads loaded models: `GLTFLoader` keeps a file's interleaving.

### Editing an interleaved vertex

```js
position.setY(4, 0.95);
position.needsUpdate = true; // marks the whole shared buffer
```

`needsUpdate` marks the shared buffer, `position.data`, so all of it uploads again, UVs included. It takes the same memory as separate lists; the difference is that changing one attribute sends them all.

### Turning it back into separate lists

```js
import { deinterleaveGeometry } from 'three/addons/utils/BufferGeometryUtils.js';
deinterleaveGeometry(geometry); // every attribute gets its own list again
```

Separate lists are easier to work with when one attribute changes often, like positions in a mesh that deforms.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
