---
id: 1.geometry.winding-order.read-the-code.1
loop: 1
tier: core
concepts: [geometry.winding-order]
mode: read-the-code
context: geometry.winding-order/inside-out
lenses: []
misconceptions:
  - geometry.winding-order/normals-flip-culling
---

# Winding order

> **In short:** The order a triangle's three corners are listed in decides which side is its front: the side from which they run counter-clockwise, which is the side three.js draws.
>
> **Used for:** Skipping the hidden insides of every closed shape, which saves drawing work; fixing models that import inside out; mirroring a part without it turning inside out; and thin things like leaves, flags, and glass that have to show both sides.

## A · The basics

### A triangle has a front and a back

Every triangle's corners are listed in an order: the index order on the indexed vs non-indexed page, or the vertex order when there's no index. Look at the triangle from one side and that order runs counter-clockwise. Walk around to the other side and the same order runs clockwise.

three.js calls the counter-clockwise side the **front**. The order is the triangle's **winding order**.

**Analogy: a clock painted on a glass door.** From the hallway, its hands sweep clockwise. From the room on the other side, the same hands sweep counter-clockwise. The clock didn't change; only the side you're standing on did.

### three.js skips the backs

On a closed shape like a box or a ball, the backs of the triangles all face inward, hidden behind the fronts. So by default three.js doesn't draw a triangle whose back faces the camera. That's **back-face culling**, and it saves drawing work on every closed shape.

Turn the triangle and switch the corner order. When the camera sees the back, the triangle isn't drawn; only its gray outline, drawn separately, stays.

<div data-scene="corners"></div>

### Culling reads the corners, not the normals

A mesh's normals, the directions its surface faces (the normal matrix page), are for lighting. Culling never looks at them: the GPU decides front or back from the order the corners land on screen.

So flipping the normals and reversing the winding do different things. Try all three on the box. The front face is yellow, and the back face, hidden behind it, is blue.

<div data-scene="flip"></div>

- **Flip the normals:** the same yellow face is drawn, but it's lit as if it faced away from the light, so it goes dark.
- **Reverse the winding:** every front becomes a back. The near faces vanish and you see the inside of the far faces, blue included. The box is **inside out**.

## B · Working knowledge

### Which side draws

```js
material.side = FrontSide;  // the default: fronts only
material.side = BackSide;   // backs only, like the inside of a room or a sky dome you stand in
material.side = DoubleSide; // both
```

Raycasting follows `side` too. With `FrontSide`, a ray that meets a triangle from behind passes through it, so a raycast from inside a `FrontSide` room hits nothing.

### Fixing an inside-out model

The signs: near walls vanish, you see far walls from the inside, and clicks pass through the near side. Reverse every triangle's corner order by swapping two of its corners:

```js
const index = geometry.index;
for (let i = 0; i < index.count; i += 3) {
  const b = index.getX(i + 1);
  index.setX(i + 1, index.getX(i + 2));
  index.setX(i + 2, b);
}
index.needsUpdate = true;
```

If its normals point inward as well, `geometry.computeVertexNormals()` rebuilds them from the new order (the vertex normals page). Two things that look like fixes aren't:

- **Flipping the normals** changes only the lighting. The same faces are still skipped.
- **`DoubleSide`** shows the outside again, but three.js now takes the outside faces for backs and flips their normals for lighting, so they light wrong. It also draws every back face.

### Mirroring

`mesh.scale.x = -1` mirrors a mesh, and three.js notices and swaps which side it skips, so it still draws right side out. A mirror baked into the geometry, like `geometry.scale(-1, 1, 1)`, reverses every triangle's winding and turns it inside out. The negative scale and determinant page, in the transforms domain, covers both; the fix for the baked one is the loop above.

### When DoubleSide is worth it

Use it for things that are a single layer thick: leaves, paper, flags, a glass pane, or an open box you can look into. What it costs:

- Back faces aren't skipped, so the GPU handles every triangle, even ones that end up hidden.
- A **transparent** `DoubleSide` material is drawn twice, backs first and then fronts, so it's two draw calls. That way the far side is drawn first and the near side blends over it. `material.forceSinglePass = true` draws it once, and the two sides may then blend in the wrong order.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
