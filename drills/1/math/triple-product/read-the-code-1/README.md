---
id: 1.math.triple-product.read-the-code.1
loop: 1
tier: light
concepts: [math.triple-product]
mode: read-the-code
context: math.triple-product/above-below-triangle
lenses: []
misconceptions:
  - math.triple-product/handedness
---

# Scalar triple product

> **In short:** A cross product followed by a dot product, whose sign says which side of a surface a point is on.
>
> **Used for:** Above-or-below-a-surface checks, spotting mirrored objects, and the volume of simple shapes.

## A · The basics

### Which side is it on?

This one is a recipe made from the cross product and dot product pages, and it answers a common question: is a point above or below a surface?

1. Cross two edges of a triangle. That gives the direction the triangle faces, its normal.
2. Dot that normal with the move from the triangle to the point.

The sign answers the question. Positive means the point is on the side the triangle faces, negative means the other side, and 0 means it's exactly on the triangle's plane: the flat surface the triangle lies in, which carries on past its edges, so the point isn't necessarily inside the triangle.

**Analogy: a cup and a table.** The table's top faces up. A cup sitting on it is on the facing side; a cup on the floor underneath is on the other side.

Move the point up and down through the triangle:

<div data-scene="side"></div>

The name comes from the three directions involved: two edges crossed, then dotted with a third.

## B · Working knowledge

### Above or below a triangle

```js
const normal = new Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a));
const side = normal.dot(point.clone().sub(a)); // > 0 in front, < 0 behind
```

three.js wraps this in `Plane`. `distanceToPoint` returns the signed distance, positive on the side the normal faces:

```js
const plane = new Plane().setFromCoplanarPoints(a, b, c);
plane.distanceToPoint(point);
```

### Is an object mirrored?

The same recipe applied to an object's three axes tells you whether it has been mirrored, for example by a scale of −1 on one axis. three.js notices a mirrored mesh and flips which side counts as the front, but anything it doesn't look at, like your own geometry code, instanced meshes, physics, or exporters, has to check for itself:

```js
const mirrored = xAxis.dot(new Vector3().crossVectors(yAxis, zAxis)) < 0;
```

The transforms domain shows the everyday version of this check: `matrix.determinant() < 0`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
