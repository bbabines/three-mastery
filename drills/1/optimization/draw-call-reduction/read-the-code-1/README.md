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

> **In short:** Draw call reduction draws the same picture with fewer draw calls, by merging parts that never move, drawing repeats as one InstancedMesh, and drawing different shapes that share a material as one BatchedMesh, which saves CPU time but not GPU work.
>
> **Used for:** A warehouse full of identical racks and bins; a room, a factory floor, or a city block that never moves; a CAD model that arrives as thousands of small parts; and a forest or a crowd grown from a handful of shapes.

## A · The basics

### Same picture, fewer requests

The draw call anatomy page showed that every mesh in view costs at least one draw call, and that each one costs about the same CPU time, however small the mesh. Five hundred bolts are five hundred draw calls, even when they share a geometry and a material. Draw call reduction draws the same picture with fewer calls. Three tools do most of the work:

| Tool | What it does | Reach for it when | The catch |
| --- | --- | --- | --- |
| `mergeGeometries` | Joins many geometries into one, drawn as one mesh | Parts that never move: shelving, walls, a factory floor | The merged parts can't move, hide, or be culled one by one |
| `InstancedMesh` | Draws one geometry many times in one call (the InstancedMesh page) | Repeats: bolts, bins, chairs | One shape and one material for every copy |
| `BatchedMesh` | Draws different geometries that share one material in one call | Many different parts with the same look | One call only where the browser has multi-draw |

All three need the parts to share one material. Sharing a material is where it starts, but on its own it merges nothing.

**Analogy: sending mail.** Two hundred letters to one street are two hundred stamps and two hundred trips to the mailbox, whatever's inside. Pack them in one parcel (merging), or send one form letter with a list of addresses (instancing), and the post office handles one item. The carrier still walks to every door: the GPU still draws every triangle.

Try each tool on the rack's steel frame and on its bins. The readout shows the code, and the draw calls and triangles from `renderer.info.render`. The floor grid is hidden so it doesn't add to the count.

<div data-scene="fixes"></div>

### Fewer calls, same pixels

Cutting a draw call saves its CPU time. The GPU's work stays: the same triangles land on the same pixels, and each pixel is shaded as before. So fewer draw calls only speed up a frame that was waiting on the CPU. A scene that's slow because of pixel work, which you'll see called **fill-rate-bound**, stays just as slow. The frame budget page covers why the slower side sets the pace, and Loop 3's proof experiments find out which side that is.

Twelve see-through panels overlap in front of the camera. Each one adds a little light wherever it's drawn, so a pixel's brightness shows how many panels were shaded there. Switch to one InstancedMesh: the draw calls drop to 1, and the picture, with all the pixel work in it, stays the same.

<div data-scene="fillRate"></div>

## B · Working knowledge

### Merging parts that never move

```js
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const pieces = [];
frame.updateMatrixWorld();
frame.traverse((part) => {
  if (part.isMesh) pieces.push(part.geometry.clone().applyMatrix4(part.matrixWorld));
});
scene.add(new Mesh(mergeGeometries(pieces), steel));
```

- **Bake each part's place into its copy.** A geometry doesn't know where its mesh stands. Without `applyMatrix4(part.matrixWorld)`, every piece lands at the center of the scene, on top of the others. `clone()` first, since `applyMatrix4` changes the geometry itself, and other meshes may share it.
- **The pieces must match:** the same attributes (all with UVs, or none), and all indexed or none. Otherwise `mergeGeometries` logs an error and returns `null`.
- **The merged mesh is one object.** It's culled, hidden, and raycast as a whole. Merge what never changes.
- `mergeGeometries(pieces, true)` keeps a group per piece, for a material array, and with a material array each group is its own draw call again (the groups page).

### Repeats: instance, don't merge

Merging 500 bolts puts 500 copies of the bolt's vertices in GPU memory. An InstancedMesh keeps one copy plus a matrix for each bolt, and it's one draw call too. Merge unique parts; instance repeats.

### Different shapes, one material: BatchedMesh

```js
const batch = new BatchedMesh(200, 20000, 40000, steel); // copies, vertices, indices it can hold
const postId = batch.addGeometry(postGeometry);          // each shape once
const i = batch.addInstance(postId);                     // then any number of copies
batch.setMatrixAt(i, post.matrixWorld);
```

- It's one draw call where the browser has WebGL's multi-draw extension, and `renderer.extensions.has('WEBGL_multi_draw')` says whether it does. Without it, three.js draws each visible copy with a call of its own.
- Unlike a merged mesh, it culls each copy on its own, and each copy can still move.

### Parts with different textures

Parts with different textures can't share a material. A **texture atlas** packs their pictures into one texture, and each part's UVs point at its own patch of it (the UVs page), so the parts can share a material and be merged or batched. Atlases are usually made along with the model, before it reaches three.js.

### Which space is it in?

| Value | Space |
| --- | --- |
| A part's geometry, before merging | Measured from the part itself |
| The merged geometry, after `applyMatrix4(part.matrixWorld)` | The world, so the merged mesh stays at the origin, unturned and unscaled |
| The matrix passed to `setMatrixAt`, on an InstancedMesh or a BatchedMesh | Measured from the InstancedMesh or BatchedMesh itself |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
