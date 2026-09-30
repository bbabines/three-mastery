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

> **In short:** A `Box3` can't turn, so it grows loose around a turned object, while an OBB turns with it and stays snug.
>
> **Used for:** Collisions between turned parts, selection boxes that hug a product, and bounds around beams and pipes.

## A · The basics

### A box that can't turn

An **AABB** (axis-aligned bounding box), like three.js's `Box3`, only stores a `min` and a `max` corner, so its sides always run along the world's X, Y, and Z. Around an object that's turned, it has to grow until the whole object fits inside, corners and all, so it ends up much bigger than the object.

An **OBB** (oriented bounding box) also stores a turn, so it can sit at the same angle as the object and fit it exactly. three.js has one as an add-on, `OBB`.

**Analogy: a picture frame on a shelf.** Hang it crooked in a cubby and the cubby has to be much wider and taller than the frame. A case shaped like the frame, tilted with it, stays snug.

Turn the two planks. They never touch, but once they're turned, their `Box3`s overlap. The OBBs, drawn around each plank, don't.

<div data-scene="turnedPlanks"></div>

## B · Working knowledge

### Using an OBB

```js
import { OBB } from 'three/addons/math/OBB.js';
plank.geometry.computeBoundingBox();
const obb = new OBB().fromBox3(plank.geometry.boundingBox); // measured from the plank itself
obb.applyMatrix4(plank.matrixWorld);                        // now in the world
```

`obb.intersectsOBB(otherObb)` then says whether two planks really touch. Rebuild it after the object moves.

### When to use which

Use a `Box3` first: its test is six comparisons, and most pairs are far apart. Use an OBB for the pairs that are left, when a false alarm matters, like a crate that "hits" a diagonal beam it isn't touching. Test triangles only when even an OBB is too rough, like a curved part.

### `setFromObject(object, true)`

`new Box3().setFromObject(object, true)` works from every vertex instead of each part's own bounding box, which fits round shapes tighter. It's still a `Box3`, though: `true` doesn't turn it.

### Showing bounds

`Box3Helper(box)` draws a `Box3`. For an OBB there's no helper, so draw the edges of a box the object's size as a child of the object, and it turns with it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
