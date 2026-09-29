---
id: 1.queries.aabb-vs-obb.read-the-code.1
loop: 1
tier: light
concepts: [queries.aabb-vs-obb]
mode: read-the-code
context: queries.aabb-vs-obb/tight-overlap
lenses: []
misconceptions:
  - queries.aabb-vs-obb/box3-tight
---

# AABB vs OBB

> **In short:** A `Box3` always stays lined up with the world's axes, so around a turned object it's a loose, oversized box; an OBB turns with the object and fits it snugly.
>
> **Used for:** Checking whether two turned parts really collide, drawing a selection box that hugs a rotated product, keeping boxes from false alarms when parts sit at an angle, and fitting bounds around long diagonal things like pipes and beams.

## A · The basics

### A box that can't turn

An **AABB** (axis-aligned bounding box), like three.js's `Box3`, only stores a `min` and a `max` corner, so its sides always run along the world's X, Y, and Z. Around an object that's turned, it has to grow until the whole object fits inside, corners and all. Each plank in the scene below, turned 45°, gets a box more than five times its own size.

An **OBB** (oriented bounding box) also stores a turn, so it can sit at the same angle as the object and fit it exactly. three.js has one as an add-on, `OBB`.

**Analogy: a picture frame on a shelf.** Hang it crooked in a cubby and the cubby has to be much wider and taller than the frame. A case shaped like the frame, tilted with it, stays snug.

Turn the two planks. They never touch, but once they're turned, their `Box3`s overlap. The OBBs, drawn around each plank, don't.

<div data-scene="turnedPlanks"></div>

## B · Working knowledge

### Using an OBB

```js
import { OBB } from 'three/addons/math/OBB.js';

plank.geometry.computeBoundingBox(); // measured from the plank itself
const obb = new OBB().fromBox3(plank.geometry.boundingBox).applyMatrix4(plank.matrixWorld); // now in the world
if (obb.intersectsOBB(otherObb)) { /* they really touch */ }
```

It also has `containsPoint`, `intersectsBox3`, `intersectsSphere`, and `intersectRay`. Rebuild it after the object moves.

### When to use which

- **AABB first.** A `Box3` test is six comparisons, and most pairs are far apart. Use it to rule things out.
- **OBB for the pairs that are left,** when a false alarm matters: a crate that "hits" a diagonal beam it isn't touching, or a drop that's refused for no visible reason.
- **Triangles last,** only when even an OBB is too rough, like a curved part.

### `setFromObject(object, true)`

`new Box3().setFromObject(object)` works from each part's own bounding box, so round shapes come out looser than they need to. Passing `true` works from every vertex instead, which fits tighter and costs a pass over every vertex. Either way it's still a `Box3`, lined up with the axes: `true` doesn't turn it. The world-space bounds page, in the scene graph domain, covers `setFromObject`.

### Showing bounds

`Box3Helper(box)` draws a `Box3`. For an OBB there's no helper; draw the edges of a box the object's size as a child of the object, and it turns with it, as the outlines in the scene do.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
