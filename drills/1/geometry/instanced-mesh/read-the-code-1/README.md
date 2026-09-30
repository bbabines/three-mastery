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

> **In short:** Stamps the same shape and material in many places at once, so hundreds of copies cost a single draw call.
>
> **Used for:** Rows of identical bolts or chairs, forests from one tree, picking which copy was clicked, and coloring copies by status.

## A · The basics

### One draw call, many copies

Separate meshes cost a draw call each, even when they share a geometry and a material. An **InstancedMesh** hands the GPU the geometry once, plus a matrix for each copy, and draws every copy in one draw call:

```js
const bins = new InstancedMesh(binGeometry, material, 18); // room for 18 copies
bins.setMatrixAt(i, matrix); // where copy i sits, how it's turned, and its size
scene.add(bins);
```

Each copy's matrix is measured from the InstancedMesh itself, the way a child's `position` is measured from its parent, so moving the InstancedMesh moves every copy.

**Analogy: a rubber stamp.** One stamp and one ink pad make 18 prints, each at its own spot and angle. You can't change the stamp's shape or swap the ink for a single print.

### Changing copies after the first draw

The matrices live in an attribute, `bins.instanceMatrix`, so after the first draw a change reaches the screen only with `needsUpdate`. An InstancedMesh also keeps a bounding sphere of its own, around all its copies, and moving a copy doesn't update it.

Pull bin 4 out of the rack with each version of the code. The scanner aims at bin 4's new spot, and the faint ball is the bounding sphere.

<div data-scene="pull"></div>

## B · Working knowledge

### Moving copies

```js
bins.setMatrixAt(4, matrix);
bins.instanceMatrix.needsUpdate = true; // send the matrices again
bins.computeBoundingSphere();           // its own bounds, around all the copies
```

Skip `computeBoundingSphere()` after a copy moves outside the old sphere, and culling can hide the whole InstancedMesh while that copy is on screen, and raycasts can miss it. `bins.count = 10` draws only the first 10 copies.

### Coloring the copy that was clicked

```js
const hit = raycaster.intersectObject(bins)[0];
bins.setColorAt(hit.instanceId, new Color('orange')); // instanceId: which copy
bins.instanceColor.needsUpdate = true;
```

The copy's color multiplies the material's color, so use a white material for true colors. Call `setColorAt` once before the first render too, so three.js doesn't have to rebuild the shader when colors first appear.

### Different materials

Every copy shares the one material. An InstancedMesh accepts a material array, but it works through the geometry's groups, so it applies the same way to every copy. For copies in really different materials, like fabric and leather seats, use one InstancedMesh per material.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
