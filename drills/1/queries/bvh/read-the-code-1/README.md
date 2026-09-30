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

> **In short:** Boxes inside boxes around a mesh's triangles, so a raycast can skip most of them instead of testing each one.
>
> **Used for:** Picking on detailed scans, keeping characters out of walls, collision checks, and finding the nearest spot on a big model.

## A · The basics

### The problem: every triangle

Once a ray touches a mesh's bounding sphere, three.js tests every one of its triangles. A detailed scan of 2 million triangles is 2 million tests per raycast, and hover raycasts every frame. The bounding sphere skips whole objects, but it can't help inside one big one.

### Boxes inside boxes

A **BVH** (bounding volume hierarchy) sorts the triangles into boxes:

1. Put one box around all the triangles.
2. Split the triangles into two halves, and put a box around each half.
3. Keep splitting until each box holds only a handful of triangles.

A ray starts at the top box. If it misses, it misses everything inside, and the test is over. If it hits, it tries the two boxes inside, and goes on down only into the boxes it hits. At the bottom it tests just the triangles in the few boxes it reached. Doubling the triangles adds one level to the tree: a few more box tests, not twice the work.

**Analogy: finding a book in a library.** You pick the floor, then the section, then the shelf, and only read the spines on that one shelf. Every choice rules out everything on the other floors and shelves.

Aim the ray and raise the detail. The yellow boxes are the ones whose triangles got tested, and the readout compares the work with and without the tree.

<div data-scene="boxesInBoxes"></div>

<details>
<summary>The math, if you're curious</summary>

Testing every triangle is **O(n)**, read "order n": the work grows in step with the triangle count n. A balanced tree brings a typical ray down to about O(log n), so a million triangles need about 20 levels.

</details>

## B · Working knowledge

### Adding one to a mesh

three.js has no BVH of its own; the library people use is three-mesh-bvh. Once its functions are added to three.js's `BufferGeometry` and `Mesh`, you build the tree once, and raycasts against that mesh go through it:

```js
geometry.computeBoundsTree();  // once, after three-mesh-bvh is set up
raycaster.firstHitOnly = true; // stop at the nearest hit, faster still
```

Add one for big meshes you query often, like hover over a detailed scan. It usually starts to matter at tens of thousands of triangles.

### What it doesn't speed up

A BVH answers questions about a mesh: raycasts, collisions, nearest points. It doesn't make drawing faster, since the GPU still draws every triangle. It saves next to nothing on a 12-triangle crate. And a scene of 5,000 small parts is slow because of the 5,000 objects to walk, which a target list or a box around each group fixes, not a BVH.

### What it costs

Building sorts every triangle into boxes, which takes CPU time up front and memory alongside the geometry. Move vertices and the boxes still fit the old shape, so queries miss the parts that moved. A **refit** re-measures each box around the triangles already in it, much cheaper than a rebuild.

Try all three buttons. Push out the bump, and the ray hits it, but the tree's flat boxes say there's nothing there. Refit, and they agree again.

<div data-scene="staleBoxes"></div>

Moving or turning the mesh is fine, since the boxes are measured from the object itself. Only changing the vertices makes them stale.

### Shape casts and collision

The same tree answers other questions quickly: which triangles lie inside this box or sphere, and what's the nearest spot on the mesh to this point. That's how a character's body is kept out of a level's walls. three-mesh-bvh calls these shape casts.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
