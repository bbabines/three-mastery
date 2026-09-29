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

> **In short:** The object type decides how three.js draws a shape, as solid triangles, dots, lines, or a picture that always faces the camera, and how many draw calls it takes; a Group draws nothing and only holds other objects.
>
> **Used for:** A warehouse with hundreds of identical shelves; a laser scan of a room shown as a cloud of dots; dimension lines and wireframes in a product configurator; and name tags that always face the viewer.

## A · The basics

### Every drawn thing is geometry, a material, and a type

Everything on this page is an Object3D, so it moves, turns, and hides the same way (the Object3D API tour). What each type adds is drawing. Most take two things:

- a **geometry**: the shape's data, meaning its corner points and what's stored with each one. The rest of this domain opens it up, starting with the BufferAttribute and itemSize page.
- a **material**: how it looks, like its color and how it reacts to light.

The type decides what the GPU makes from them. The same geometry can draw as a solid `Mesh`, a cloud of `Points`, or `LineSegments` along its edges.

The type also decides the cost. A **draw call** is one request from three.js, running on the CPU, to the GPU: "draw this geometry with this material." Each one costs CPU time every frame before the GPU draws anything, so ten thousand small draw calls can be slower than one big one. The draw call anatomy page, in the GPU domain, looks inside one.

**Analogy: orders at a print shop.** Every order has the same paperwork, whether it's for one poster or five hundred. A `Mesh` is an order for one poster. An `InstancedMesh` is one order for five hundred copies of the same poster. A `BatchedMesh` is one order for several different posters printed on the same paper. A `Group` is the folder the orders sit in: nothing gets printed for it.

### The members, at a glance

| Type | What it draws | Pick it when | Draw calls |
| --- | --- | --- | --- |
| `Mesh` | Solid triangles, from one geometry and one material | Almost anything: a part, a floor, a model | One (one per group when it has several materials, the groups page) |
| `InstancedMesh` | One geometry and one material, many copies, each placed by its own matrix | Many identical things: shelves, bolts, trees | One for all the copies |
| `BatchedMesh` | Different geometries that share one material, each placed by its own matrix | Many different parts with the same look | One, where the browser supports multi-draw |
| `Points` | A square dot at each corner point | Scans, particles, stars | One |
| `Line`, `LineSegments` | Lines through the corner points, 1 pixel wide | Outlines, wireframes, dimension lines, paths | One |
| `Sprite` | A flat picture that always faces the camera | Labels, icons, markers | One per sprite |
| `Group` | Nothing | Holding parts that move together | None, but its children still cost theirs |

This page only maps them out. The InstancedMesh page, later in this domain, covers instancing, and the draw call reduction page, in the optimization domain, covers when to reach for instancing and batching.

Try each type on the same three racks. The readout shows the line that built it and the draw calls three.js made for it in the last frame, read live from `renderer.info.render.calls`. The floor grid is hidden so it doesn't add to the count.

<div data-scene="members"></div>

## B · Working knowledge

### Mesh

```js
const shelf = new Mesh(new BoxGeometry(1.2, 0.06, 0.5), new MeshStandardMaterial({ color: 'orange' }));
scene.add(shelf);
```

- Many meshes can share one geometry and one material. That saves memory, not draw calls: 500 meshes are 500 draw calls, whatever they share.
- A whole model merged into one geometry is one `Mesh` and one draw call. `mergeGeometries` from three.js's addons does the merging; the draw call reduction page covers when it's worth it.

### InstancedMesh

```js
const shelves = new InstancedMesh(shelfGeometry, material, 15); // 15 copies
shelves.setMatrixAt(i, matrix); // where copy i sits, how it's turned, and its size
```

Every copy is the same shape with the same material. Only the matrix, and optionally the color, changes from copy to copy. The InstancedMesh page covers the rest, including the updates it needs after the first render.

### BatchedMesh

```js
const batch = new BatchedMesh(maxCopies, maxVertices, maxIndices, material);
const shelfId = batch.addGeometry(shelfGeometry);
const postId = batch.addGeometry(postGeometry);
const i = batch.addInstance(shelfId); // a copy of the shelf shape
batch.setMatrixAt(i, matrix);
```

- **It isn't an InstancedMesh.** An InstancedMesh repeats one shape. A BatchedMesh holds different shapes, and any number of copies of each, under one shared material. For shelves, posts, and bins that all look the same, one BatchedMesh can draw the lot.
- You tell it up front how many copies and how much geometry data it can hold, so it can set aside the space once.
- It's one draw call when the browser has WebGL's multi-draw extension. Without it, three.js falls back to one draw call per copy. The **BatchedMesh** button in the scene shows which one your browser gets.

### Points

```js
const scan = new Points(scanGeometry, new PointsMaterial({ color: 'white', size: 0.02 }));
```

- One square dot per corner point, with no triangles between them. A scan of a room is usually just a position for each dot, and maybe a color.
- `size` shrinks with distance by default, like everything else in the scene. With `sizeAttenuation: false` it's a fixed size in pixels.

### Line and LineSegments

```js
const edges = new LineSegments(new EdgesGeometry(rackGeometry), new LineBasicMaterial({ color: 'white' }));
const dimension = new Line(new BufferGeometry().setFromPoints(points), new LineBasicMaterial());
```

- `Line` joins each point to the next one, like a pencil that never lifts. `LineSegments` joins them in pairs: 0 to 1, 2 to 3, and so on. `LineLoop` is a `Line` that closes back to the start.
- `EdgesGeometry` keeps only the edges where two faces meet at an angle, so a box gets its 12 edges and no diagonals. `material.wireframe = true` on a mesh draws every triangle's edges instead, diagonals included.
- **`linewidth` does nothing in WebGL.** The WebGL renderer draws every line 1 pixel wide, whatever `linewidth` says; three.js's own docs say so. For thick lines, three.js's addons have `Line2`, `LineSegments2`, and `LineMaterial` (`three/addons/lines/Line2.js`), which draw each line as flat triangles.

### Sprite

```js
const tag = new Sprite(new SpriteMaterial({ map: tagTexture }));
tag.scale.set(0.6, 0.3, 1);
```

- A flat picture that always turns to face the camera, sized by `scale`. The labels on these pages are sprites.
- Each sprite is its own draw call, so a few dozen labels are fine and thousands aren't.

### Group

```js
const rack = new Group();
rack.add(postA, postB, shelf);
scene.add(rack);
```

A Group draws nothing and costs no draw call. It's there to move, turn, and hide its children together. The meshes inside still cost one draw call each, so a model loaded from a file, which arrives as groups of meshes, can be dozens of draw calls even though it's "one model."

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
