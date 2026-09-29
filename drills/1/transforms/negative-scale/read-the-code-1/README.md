---
id: 1.transforms.negative-scale.read-the-code.1
loop: 1
tier: light
concepts: [transforms.negative-scale]
mode: read-the-code
context: transforms.negative-scale/left-right
lenses: []
misconceptions:
  - transforms.negative-scale/mirror-same
---

# Negative scale and determinant

> **In short:** A minus sign in an object's scale mirrors it, and three.js spots the mirror with one number, the determinant, so the object still draws right side out; a mirror baked into the geometry's own points gets no such help.
>
> **Used for:** Making the left-hand version of a right-hand part, building a symmetrical model from one half, fake reflections on a shiny floor drawn as an upside-down copy, and making sense of models that arrive mirrored from other tools.

## A · The basics

### A minus sign mirrors

`mesh.scale.x = -1` flips an object left to right, as if you were seeing it in a mirror. It's the cheapest way to get a left/right pair: one model, two meshes, where the left one has a scale of (−1, 1, 1).

**Analogy: gloves in a mirror.** Hold a right glove up to a mirror and the reflection is a left glove. No amount of turning makes a right glove into a left one. Only a mirror does that.

Two minus signs cancel: a scale of (−1, −1, 1) is a half turn, not a mirror. An odd number of minus signs mirrors.

### three.js notices the mirror

Each triangle in a mesh has a front and a back, and three.js normally draws only the front. That saves work, since on a closed shape the backs all face the inside. A mirror swaps which side of each triangle looks like the front, so without help a mirrored object would draw only its insides. (How three.js tells front from back is the winding order page, in the geometry domain.)

So before drawing each mesh, three.js checks whether its `matrixWorld` mirrors, and if it does, it swaps which side it hides. Because it checks `matrixWorld`, a mirror on any parent counts too.

The check is the **determinant**: a single number you can get from any matrix. It's negative when the matrix mirrors and positive when it doesn't.

```js
const mirrored = mesh.matrixWorld.determinant() < 0;
```

three.js r186 itself uses `determinantAffine()`, a quicker version that gives the same number for an object's matrix.

<details>
<summary>The math, if you're curious</summary>

For a plain resize, the **determinant** is the three scale numbers multiplied together: a scale of (−1, 1, 1) gives −1, (−1, −1, 1) gives 1, and (2, 3, 1) gives 6. Turning and moving don't change it. Its size says how much the matrix grows volumes, and its sign says whether it mirrors.

</details>

### Mirroring the geometry instead

`geometry.scale(-1, 1, 1)`, or `geometry.applyMatrix4` with a mirror in it, **bakes** the mirror in: it moves the geometry's points themselves, and the mesh keeps a scale of (1, 1, 1). Its determinant is positive, so three.js sees nothing to fix. The points are mirrored, but each triangle's corners are still listed in the old order, which now says the back faces the outside. three.js hides the outside and draws the inside, and the object looks inside out. The normals are fine: `applyMatrix4` turns them with the normal matrix (the normal matrix page).

Try the three buttons on the left-hand copy, and turn the view to look at it from a few sides.

<div data-scene="mirror"></div>

## B · Working knowledge

### Left and right variants

Mirror the object, not the geometry. `clone` shares the geometry and material, so the pair costs almost nothing:

```js
const left = right.clone();
left.scale.x = -1;
```

### When the mirror has to be baked

Sometimes it has to be in the geometry: merging parts into one geometry, exporting a file, or handing the shape to a physics engine. After baking a mirror, reverse each triangle's corner order. r186 has no built-in method for it. For a geometry with an index (the list of which points make up each triangle), swap two corners of every triangle:

```js
geometry.scale(-1, 1, 1);
const index = geometry.index;
for (let i = 0; i < index.count; i += 3) {
  const b = index.getX(i + 1);
  index.setX(i + 1, index.getX(i + 2));
  index.setX(i + 2, b);
}
index.needsUpdate = true;
```

A geometry without an index needs the same swap in every attribute. `material.side = DoubleSide` isn't a fix: the outside shows again, but three.js takes those faces for backs and flips their normals, so the lighting comes out wrong.

### It breaks clicks too

A baked mirror isn't only a drawing problem:

- **Raycasts** skip triangles whose back faces the ray, as drawing does (with the default `FrontSide` material), so a click can pass through the near side and hit the inside of the far wall.
- **`hit.face.normal`** is worked out from the corner order, so it points inward.
- **`computeVertexNormals()`** works from the corner order too, so running it after a baked mirror turns every normal inward.

A mirror done with `scale.x = -1` has none of these problems.

### Mirrored imports

Models from other tools sometimes arrive with a negative scale on a node, and three.js handles those like any other. Two things can still surprise you:

- **The numbers can move.** When three.js splits a mirrored matrix back into position, rotation, and scale (the compose and decompose page), it always puts the minus sign on X and adds a half turn to make up for it. So after `attach`, a scale of (1, −1, 1) can come back as (−1, 1, 1) with a half turn in `rotation.z`. It looks the same; only the numbers changed.
- **Copies in an `InstancedMesh` aren't checked.** three.js checks the mesh's own `matrixWorld`, not each copy's matrix, so a copy mirrored by its own matrix draws inside out. Give mirrored copies their own `InstancedMesh`, with the mirror baked into its geometry and the corners reversed as above. The InstancedMesh page is in the geometry domain.

### Which space is it in?

| Value | Space |
| --- | --- |
| `mesh.scale` | Measured from its parent |
| `mesh.matrix.determinant()` | Only the mesh's own mirror, measured from its parent |
| `mesh.matrixWorld.determinant()`, the sign three.js checks | The world: mirrors on the mesh and all its parents |
| The points `geometry.scale(-1, 1, 1)` changes | Measured from the object itself |
| `hit.face.normal` | Measured from the object itself, worked out from the corner order |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
