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

> **In short:** The order of a triangle's corners picks its front, and by default three.js skips any triangle showing the camera its back.
>
> **Used for:** Skipping hidden insides, fixing inside-out imports, mirrored parts, and two-sided leaves, flags, and glass.

## A · The basics

### A triangle has a front and a back

Every triangle's corners are listed in an order, by the index or, without one, by the vertices. Seen from one side, that order runs counter-clockwise. From the other side, the same order runs clockwise. This is the triangle's **winding order**, and three.js calls the counter-clockwise side the **front**.

**Analogy: a clock painted on a glass door.** From the hallway, its hands sweep clockwise. From the room on the other side, the same hands sweep counter-clockwise; only the side you're standing on changed.

### three.js skips the backs

On a closed shape like a box or a ball, the backs of the triangles all face inward, hidden behind the fronts. So by default three.js doesn't draw a triangle whose back faces the camera. That's **back-face culling**, and it saves drawing work on every closed shape.

Turn the triangle and switch the corner order. When the camera sees the back, only the gray outline stays.

<div data-scene="corners"></div>

### Culling reads the corners, not the normals

A mesh's normals, the directions its surface faces, are for lighting. Culling never looks at them: the GPU decides front or back from the order the corners land on screen.

Try all three on the box, whose front face is yellow and back face blue. Flipping the normals draws the same faces, lit wrong. Reversing the winding turns the box inside out, so you see the far faces from inside.

<div data-scene="flip"></div>

## B · Working knowledge

### Which side draws

```js
material.side = FrontSide;  // the default: fronts only
material.side = BackSide;   // backs only, like a room or a sky dome you stand in
material.side = DoubleSide; // both
```

Raycasting follows `side` too, so a raycast from inside a `FrontSide` room hits nothing.

### Fixing an inside-out model

The signs: near walls vanish, you see far walls from inside, and clicks pass through. Swap two corners of every triangle, then set `index.needsUpdate = true`:

```js
for (let i = 0; i < index.count; i += 3) {
  const b = index.getX(i + 1);
  index.setX(i + 1, index.getX(i + 2)).setX(i + 2, b);
}
```

If the normals point inward too, `computeVertexNormals()` rebuilds them from the new order. Flipping the normals only changes the lighting. `DoubleSide` shows the outside again, but three.js takes those faces for backs and lights them wrong.

### Mirroring

`mesh.scale.x = -1` mirrors a mesh, and three.js notices and swaps which side it skips, so it still draws right side out. A mirror baked into the geometry, like `geometry.scale(-1, 1, 1)`, reverses every triangle's winding and turns it inside out; the loop above fixes it.

### When DoubleSide is worth it

Use it for things a single layer thick: leaves, paper, flags, or a glass pane. Back faces are no longer skipped, and a transparent `DoubleSide` material is drawn twice, backs first, as two draw calls. `forceSinglePass = true` draws it once, and the sides may then blend in the wrong order.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
