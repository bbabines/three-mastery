---
id: 1.queries.bvh.read-the-code.1
loop: 1
tier: core
concepts: [queries.bvh]
mode: read-the-code
context: queries.bvh/high-poly-picking
lenses: []
misconceptions:
  - queries.bvh/speeds-everything
---

# BVH

> **In short:** A BVH is a tree of boxes built over a mesh's triangles, so a raycast tests a few boxes and skips every triangle inside the boxes it misses, instead of testing every triangle one by one.
>
> **Used for:** Hovering and clicking on detailed 3D scans and CAD models, keeping a character from walking through the walls of a level, checking whether a moving part collides with a detailed machine, and finding the nearest spot on a big model.

## A · The basics

### The problem: every triangle

The ray–triangle page ended with the cost: once a ray touches a mesh's bounding sphere, three.js tests every one of its triangles. A detailed scan of 2 million triangles is 2 million tests per raycast, and hover raycasts every frame. The bounding sphere helps skip whole objects, but it can't help inside one big one.

### Boxes inside boxes

A **BVH** (bounding volume hierarchy) sorts the triangles into boxes:

1. Put one box around all the triangles.
2. Split the triangles into two halves, and put a box around each half.
3. Keep splitting until each box holds only a handful of triangles.

A ray starts at the top box. If it misses, it misses everything inside, and the test is over. If it hits, it tries the two boxes inside, and goes on down only into the boxes it hits. At the bottom it tests just the triangles in the few boxes it reached, with the same `intersectTriangle` as before. The box tests are the ray–AABB page's `intersectsBox`.

Doubling the triangles adds one level to the tree: a few more box tests, not twice the work.

**Analogy: finding a book in a library.** You don't check every book. You pick the floor, then the section, then the shelf, and only read the spines on that one shelf. Every choice rules out everything on the other floors and shelves.

Aim the ray and raise the detail. The yellow boxes are the ones whose triangles got tested; the readout compares the work with and without the tree. The answer is the same either way. At the lowest detail, the tree saves nothing at all.

<div data-scene="boxesInBoxes"></div>

<details>
<summary>The math, if you're curious</summary>

Testing every triangle is **O(n)**, read "order n": the work grows in step with the triangle count n. A balanced tree brings a typical ray down to about **O(log n)**: each level halves what's left, so a million triangles need about 20 levels. That's typical, not guaranteed; a ray skimming along a surface enters many boxes.

</details>

## B · Working knowledge

### In practice: three-mesh-bvh

three.js has no BVH of its own. The library people use is **three-mesh-bvh**, which isn't installed in this repo. Its README shows the setup: you add its functions to three.js's `BufferGeometry` and `Mesh`, call `geometry.computeBoundsTree()` once, and raycasts against that mesh go through the tree. Setting `raycaster.firstHitOnly = true` stops at the nearest hit, which is faster still.

### What it doesn't speed up

- **Drawing.** A BVH answers questions about a mesh: raycasts, collisions, nearest points. The GPU still draws every triangle, and draw calls and pixel work don't change. A slow frame from a huge model needs the optimization domain, not a BVH.
- **Small meshes.** A crate has 12 triangles; a tree saves next to nothing and still has to be built.
- **Many small objects.** A scene of 5,000 parts is slow to raycast because there are 5,000 objects to walk and bounding spheres to test. A BVH inside each mesh doesn't change that; a target list or a box around each group does, as on the filtering and ray–AABB pages.

### What it costs

- **Building** sorts every triangle into boxes: CPU time up front, noticeable on a big model. three-mesh-bvh can build in a web worker so the page doesn't freeze.
- **Memory:** the boxes are stored alongside the geometry.
- **Edits:** move vertices and the boxes still fit the old shape, so queries can miss the parts that moved. A **refit** re-measures each box around the triangles already in it, without sorting again, which is much cheaper than a rebuild; three-mesh-bvh has one. A mesh that changes shape every frame pays for a refit every frame.

Try all three buttons. The sheet's tree is built while it's flat. Push out the bump, and a ray passing in front of the sheet hits the bump, but the tree's flat boxes say there's nothing there. Refit, and they agree again.

<div data-scene="staleBoxes"></div>

Moving or turning the mesh is fine: the boxes are measured from the object itself, and the ray is moved into the mesh's space, as for any raycast. Only changing the vertices makes them stale.

### Shape casts and collision

The same tree answers other questions quickly: which triangles lie inside this box or sphere, and what's the nearest spot on the mesh to this point. That's how a character's body is kept out of a level's walls, or a dragged part out of a machine. three-mesh-bvh calls these shape casts.

### When to add one

For big meshes you query often, like hover over a detailed scan or collisions every frame. Tens of thousands of triangles is where it usually starts to matter; that's a rule of thumb, not a hard limit. For small meshes, or to make drawing faster, don't.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
