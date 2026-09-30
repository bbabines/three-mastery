---
id: 1.optimization.draw-call-reduction.read-the-code.1
loop: 1
tier: core
concepts: [optimization.draw-call-reduction]
mode: read-the-code
context: optimization.draw-call-reduction/repeated-hardware
lenses: []
misconceptions:
  - optimization.draw-call-reduction/instancing-fill-rate
---

# Draw call reduction

> **In short:** Draws the same picture with fewer draw calls, which saves CPU time but none of the GPU's pixel work.
>
> **Used for:** Racks of identical bins, a factory floor that never moves, CAD models in thousands of parts, and forests.

## A · The basics

### Same picture, fewer requests

Every mesh in view is at least one draw call, and each one costs about the same CPU time, however small the mesh. Five hundred bolts are five hundred draw calls, even when they share a geometry and a material.

Three tools draw the same thing with fewer calls, and all three need the parts to share one material. **Merging** joins parts that never move into one mesh. An `InstancedMesh` draws one shape many times in one call, as the InstancedMesh page showed. A `BatchedMesh` draws different shapes that share a material in one call.

**Analogy: sending mail.** Two hundred letters to one street are two hundred trips to the mailbox, and one parcel is one trip. The carrier still walks to every door, the way the GPU still draws every triangle.

Try each tool on the rack's frame and on its bins. The draw calls drop; the triangles don't.

<div data-scene="fixes"></div>

### Fewer calls, same pixels

Cutting a draw call saves its CPU time, not pixel work: the GPU still shades every pixel each triangle covers. So it only speeds up a frame that was waiting on the CPU. A scene that's slow because of pixel work, called **fill-rate-bound**, stays just as slow.

Each panel adds a little light where it's drawn, so brightness shows the pixel work. Switch to one InstancedMesh: the draw calls drop to 1, and the picture doesn't change.

<div data-scene="fillRate"></div>

## B · Working knowledge

### Merging parts that never move

```js
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
frame.updateMatrixWorld();
const pieces = parts.map((part) => part.geometry.clone().applyMatrix4(part.matrixWorld));
scene.add(new Mesh(mergeGeometries(pieces), steel));
```

A geometry doesn't know where its mesh stands, so `applyMatrix4(part.matrixWorld)` bakes that into each copy. Without it, every piece lands at the center of the scene. Clone first, since `applyMatrix4` changes the geometry itself. The merged mesh is one object: it's culled, hidden, and raycast as a whole.

`mergeGeometries(pieces, true)` keeps a group per piece, for a material array, and then each group is a draw call again.

### Repeats: instance, don't merge

Merging 500 bolts stores the bolt's vertices 500 times. An InstancedMesh stores them once, plus a matrix for each bolt, and it's one draw call too. Merge unique parts; instance repeats.

### Different shapes, one material

```js
const batch = new BatchedMesh(200, 20000, 40000, steel); // copies, vertices, indices it can hold
const postId = batch.addGeometry(postGeometry);          // each shape once
batch.setMatrixAt(batch.addInstance(postId), post.matrixWorld); // then any number of copies
```

Unlike a merged mesh, each copy can still move and is culled on its own. It's one draw call only where the browser has multi-draw, which `renderer.extensions.has('WEBGL_multi_draw')` reports. Without it, each visible copy is a call of its own.

### Parts with different textures

Parts with different textures can't share a material. A **texture atlas** packs their pictures into one texture, with each part's UVs pointing at its own patch, so the parts can share a material and be merged or batched.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
