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

> **In short:** Instead of a separate list for each attribute, an interleaved buffer keeps each vertex's data together in one list, position then UV then the next vertex, and each attribute finds its own numbers with a stride and an offset.
>
> **Used for:** Reading models whose file packs each vertex's data together, which glTF allows; editing or measuring vertices by hand in such a model without scrambling it; and big meshes laid out so each vertex's data sits side by side in memory, a layout some engines prefer.

## A · The basics

### One list for several attributes

On the BufferAttribute and itemSize page, every attribute had its own list: one for positions, one for UVs. An **interleaved** buffer puts them all in one list, one vertex at a time: x, y, z, u, v for vertex 0, then x, y, z, u, v for vertex 1, and so on.

Two numbers tell each attribute where its data is:

- the **stride**: how many numbers each vertex takes in the shared list, for all the attributes together. Here it's 5.
- the **offset**: where this attribute's numbers start inside each vertex. Position starts at 0, and UV at 3.

```js
const data = new InterleavedBuffer(new Float32Array(numbers), 5);         // stride 5: x y z u v
geometry.setAttribute('position', new InterleavedBufferAttribute(data, 3, 0)); // itemSize 3, offset 0
geometry.setAttribute('uv', new InterleavedBufferAttribute(data, 2, 3));       // itemSize 2, offset 3
```

Vertex i's numbers for an attribute start at i × stride + offset. `itemSize` still says how many numbers the attribute takes; it just isn't the step from one vertex to the next anymore.

**Analogy: a spreadsheet saved two ways.** Put each vertex on a row, with columns x, y, z, u, v. Separate attributes are like saving the position columns as one file and the UV columns as another. Interleaved is saving the whole sheet row by row. The stride is how wide a row is, and the offset is which column an attribute starts in.

The panel below is interleaved. Lift a vertex both ways. `setY` finds the vertex's y with the stride and offset. The array math from the BufferAttribute page, `i * 3 + 1`, lands on a different number, often a UV, so the picture slides instead of the corner moving.

<div data-scene="lift"></div>

## B · Working knowledge

### Telling whether an attribute is interleaved

```js
const position = geometry.attributes.position;
position.isInterleavedBufferAttribute; // true when it shares a buffer
position.data.stride;                  // numbers per vertex, for all the shared attributes
position.offset;                       // where position starts inside each vertex
```

- `position.array` is the whole shared list, UVs and all, not just the positions. Code that walks it with `i * 3` reads the wrong numbers.
- `getX`, `setXYZ`, and `fromBufferAttribute` take the stride and offset into account, so the same code works on both kinds. Reach for them first in any code that reads loaded models.
- Plenty of files store each attribute separately, but glTF allows interleaving, and `GLTFLoader` keeps it when a file uses it. Code that reads loaded vertices shouldn't assume either.

### Editing an interleaved vertex

```js
position.setY(4, 0.95);
position.needsUpdate = true; // marks the whole shared buffer
```

Setting `needsUpdate` on an interleaved attribute marks its shared buffer, `position.data`, so everything in it uploads again, UVs included. The updating buffers page covers uploads, and how to send only part of a buffer.

### Turning it back into separate lists

```js
import { deinterleaveGeometry } from 'three/addons/utils/BufferGeometryUtils.js';
deinterleaveGeometry(geometry); // every attribute gets its own list again
```

`interleaveAttributes([position, uv])`, from the same file, goes the other way. Separate lists are easier to work with when you edit one attribute often, like positions in a mesh that deforms.

### What it costs

The same numbers take the same memory either way. What changes is the layout: one buffer to upload instead of several, and each vertex's data side by side. The catch is updates: changing only positions still sends the whole shared buffer unless you mark an update range.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
