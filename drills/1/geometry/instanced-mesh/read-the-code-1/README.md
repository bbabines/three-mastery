---
id: 1.geometry.instanced-mesh.read-the-code.1
loop: 1
tier: light
concepts: [geometry.instanced-mesh]
mode: read-the-code
context: geometry.instanced-mesh/repeated-hardware
lenses: []
misconceptions:
  - geometry.instanced-mesh/different-materials
---

# InstancedMesh

> **In short:** An InstancedMesh draws one geometry with one material many times in a single draw call, each copy placed by its own matrix and, if you like, tinted by its own color.
>
> **Used for:** Hundreds of identical bolts, bins, or chairs in a warehouse or a stadium; a forest grown from one tree model; finding which copy was clicked, like a seat in a seating chart; and coloring copies by status, like free and taken parking spaces.

## A · The basics

### One draw call, many copies

The object types tour showed that 500 separate meshes are 500 draw calls, even when they share a geometry and a material. An **InstancedMesh** hands the GPU the geometry once, plus a list of matrices, one per copy, and draws every copy in one draw call.

```js
const bins = new InstancedMesh(binGeometry, material, 18); // room for 18 copies
const matrix = new Matrix4();
for (let i = 0; i < 18; i++) {
  matrix.compose(spots[i], turn, size); // the compose and decompose page
  bins.setMatrixAt(i, matrix);
}
scene.add(bins);
```

Each copy's matrix is measured from the InstancedMesh itself, like a child's `position` is measured from its parent: move the InstancedMesh, and every copy moves with it.

**Analogy: a rubber stamp.** One stamp and one ink pad, pressed in 18 places, each print at its own spot and angle. You can't change the stamp's shape or swap the ink for one print. With `setColorAt`, you can tint a print, but it's still the same ink underneath.

### Changing copies after the first draw

The matrices live in an attribute, `bins.instanceMatrix`, so the updating buffers page applies: after the first draw, a change reaches the screen only with `needsUpdate`. And like a geometry, an InstancedMesh keeps a bounding sphere, of its own, around all its copies (the bounding box and sphere page). It's worked out once, and moving a copy doesn't update it.

Pull bin 4 out of the rack with each version of the code. A scanner aims at bin 4's new spot. The faint ball is the InstancedMesh's bounding sphere.

<div data-scene="pull"></div>

## B · Working knowledge

### Building one

```js
const bins = new InstancedMesh(binGeometry, material, 18);
const dummy = new Object3D();
dummy.position.set(x, y, z);
dummy.updateMatrix();
bins.setMatrixAt(i, dummy.matrix);
```

- An `Object3D` used just for its `matrix`, often called a dummy, is a common way to build each copy's matrix from a position, a rotation, and a scale.
- The count you pass is the most copies it can hold. `bins.count = 10` draws only the first 10, without making a new InstancedMesh.

### Moving copies

```js
bins.setMatrixAt(4, matrix);
bins.instanceMatrix.needsUpdate = true; // send the matrices again
bins.computeBoundingSphere();           // its own bounds, around all the copies
```

Skip `needsUpdate` and the copy doesn't move on screen. Skip `computeBoundingSphere()` after a copy moves outside the old sphere, and culling can hide the whole InstancedMesh while that copy is on screen, and raycasts can miss it.

### A color per copy

```js
bins.setColorAt(i, new Color('orange'));
bins.instanceColor.needsUpdate = true; // after the first draw
```

- The copy's color multiplies the material's color, so use a white material for true colors.
- The first `setColorAt` creates `bins.instanceColor`. Call it before the first render, so three.js doesn't have to rebuild the material's shader when colors appear later.

### Which copy was clicked

```js
const hit = raycaster.intersectObject(bins)[0];
hit.instanceId; // which copy, the same number setMatrixAt and setColorAt take
```

### Different materials

Every copy shares the one material. When some copies need a different look:

- **A tint:** `setColorAt`, above.
- **Really different materials,** like fabric and leather seats: one InstancedMesh per material, one draw call each.
- **Different shapes with one material:** a `BatchedMesh` (the object types tour).

An InstancedMesh accepts a material array, but it works through the geometry's groups (the groups and multi-material page), so it applies the same way to every copy. Copies mirrored by a negative scale in their matrix draw inside out, as the negative scale and determinant page explains.

### Which space is it in?

| Value | Space |
| --- | --- |
| `bins.position`, `.rotation`, `.scale` | Measured from its parent |
| The matrix passed to `bins.setMatrixAt(i, m)` | Measured from the InstancedMesh itself |
| `bins.boundingSphere` | Measured from the InstancedMesh itself |
| `hit.point` from a raycast | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
