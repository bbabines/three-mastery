---
id: 1.geometry.object-types-tour.read-the-code.1
loop: 1
tier: light
concepts: [geometry.object-types-tour]
mode: read-the-code
context: geometry.object-types-tour/rack-shelves
lenses: []
misconceptions:
  - geometry.object-types-tour/instanced-batched-same
  - geometry.object-types-tour/linewidth
---

# Tour: object types

> **In short:** The kind of object you create, like Mesh, Points, or Line, sets what the GPU draws and how many draw calls it costs.
>
> **Used for:** Racks of identical shelves, laser scans shown as dots, dimension lines and wireframes, and name tags that face the viewer.

## A · The basics

### Every drawn thing is geometry, a material, and a type

Everything on this page is an Object3D, so it moves, turns, and hides the same way. Most types take two things: a **geometry**, the shape's corner points and what's stored with each one, and a **material**, how it looks. The type decides what the GPU makes from them. The same geometry can draw as a solid `Mesh`, a cloud of `Points`, or `LineSegments` along its edges.

The type also sets the cost. A **draw call** is one request from three.js, running on the CPU, to the GPU: draw this geometry with this material. Each one costs CPU time every frame, so ten thousand small draw calls can be slower than one big one.

**Analogy: orders at a print shop.** Every order has the same paperwork, whether it's for one poster or five hundred. A `Mesh` is an order for one poster, and an `InstancedMesh` is one order for five hundred copies of it.

### The members, at a glance

| Type | What it draws | Pick it when | Draw calls |
| --- | --- | --- | --- |
| `Mesh` | Solid triangles, one geometry and one material | Almost anything: a part, a floor, a model | One, or one per group with several materials |
| `InstancedMesh` | Many copies of one geometry and material | Many identical things: shelves, bolts, trees | One for all the copies |
| `BatchedMesh` | Different geometries that share one material | Many different parts with one look | One, where the browser supports it |
| `Points` | A square dot at each corner point | Scans, particles, stars | One |
| `Line`, `LineSegments` | Lines through the corner points, 1 pixel wide | Outlines, wireframes, dimension lines | One |
| `Sprite` | A flat picture that always faces the camera | Labels, icons, markers | One per sprite |
| `Group` | Nothing | Parts that move together | None, but its children still cost theirs |

The groups page covers a mesh with several materials, the InstancedMesh page covers instancing, and the draw call reduction page covers when to reach for instancing and batching.

Try each type on the same three racks. The readout shows the line that built it and the draw calls it took in the last frame.

<div data-scene="members"></div>

## B · Working knowledge

### Solid parts, and holders for them

```js
const shelf = new Mesh(new BoxGeometry(1.2, 0.06, 0.5), new MeshStandardMaterial({ color: 'orange' }));
const rack = new Group();
rack.add(postA, postB, shelf);
```

Meshes can share one geometry and one material. That saves memory, not draw calls: 500 meshes are 500 draw calls. A `Group` costs no draw call itself, but the meshes inside it still cost one each, so a model loaded from a file can be dozens of draw calls.

### Many copies in one draw call

```js
const shelves = new InstancedMesh(shelfGeometry, material, 15); // 15 copies
shelves.setMatrixAt(i, matrix); // where copy i sits, how it's turned, and its size
const batch = new BatchedMesh(maxCopies, maxVertices, maxIndices, material);
batch.setMatrixAt(batch.addInstance(batch.addGeometry(postGeometry)), matrix);
```

An InstancedMesh repeats one shape: only each copy's matrix, and optionally its color, changes. A BatchedMesh holds different shapes, with any number of copies of each, under one shared material; you tell it up front how much room it needs.

### Dots and lines

```js
const scan = new Points(scanGeometry, new PointsMaterial({ color: 'white', size: 0.02 }));
const edges = new LineSegments(new EdgesGeometry(rackGeometry), new LineBasicMaterial());
const path = new Line(new BufferGeometry().setFromPoints(points), new LineBasicMaterial());
```

`Line` joins each point to the next, and `LineSegments` joins them in pairs. `EdgesGeometry` keeps only the edges where faces meet at an angle, so a box gets 12 edges and no diagonals. `linewidth` does nothing: WebGL draws every line 1 pixel wide, so thick lines need the `Line2` add-on.

### Labels that face the camera

```js
const tag = new Sprite(new SpriteMaterial({ map: tagTexture }));
tag.scale.set(0.6, 0.3, 1);
```

A sprite always turns to face the camera and is sized by `scale`. Each one is its own draw call, so a few dozen labels are fine and thousands aren't.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
