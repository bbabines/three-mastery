---
id: 1.math.cross-product.read-the-code.1
loop: 1
tier: core
concepts: [math.cross-product]
mode: read-the-code
context: math.cross-product/triangle-normal
minutes: 15
lenses: []
misconceptions:
  - math.cross-product/unit-result
  - math.cross-product/order-free
  - math.cross-product/parallel-zero
---

# Cross product

## A · The basics

### A direction at right angles to both

The dot product gives you a number. The cross product gives you a new **direction**: one at right angles to both of the directions you give it.

```js
const right = new Vector3(1, 0, 0);
const away = new Vector3(0, 0, -1);
right.clone().cross(away); // (0, 1, 0): straight up
```

Two directions lying flat on the floor have two directions at right angles to both: straight up and straight down. The cross product picks one, using the **right-hand rule**: point the fingers of your right hand along the first direction, curl them toward the second, and your thumb points along the result.

That means order matters. Swap the two inputs and the result points the opposite way.

### Its length

The cross product's length isn't 1. It shows how spread apart the two inputs are, and it equals the area of the parallelogram they form (the shaded shape below). Pointing the same way or opposite ways, they form no area, and the result is (0, 0, 0). At right angles, it's longest.

Turn b, and try swapping the order:

<div data-scene="perpendicular"></div>

<details>
<summary>The math, if you're curious</summary>

(a.y × b.z − a.z × b.y, a.z × b.x − a.x × b.z, a.x × b.y − a.y × b.x). You'll never need to do this by hand.

</details>

## B · Working knowledge

### Which way does a triangle face?

This is the main job of the cross product in 3D: finding a triangle's **normal**, the direction its front faces. Cross two of its edges, then normalize, since the cross product isn't length 1:

```js
const normal = new Vector3()
  .crossVectors(b.clone().sub(a), c.clone().sub(a))
  .normalize();
```

The order of the corners decides which side counts as the front. Swap two corners and the normal flips. three.js uses the same rule to decide which side of a triangle is its front, which comes back in the geometry domain.

<div data-scene="triangleNormal"></div>

### Left or right?

The cross product also tells you which side something is on. With Y as up:

```js
const side = new Vector3().crossVectors(forward, toTarget).y;
// side > 0: the target is to the left. side < 0: to the right.
```

The angle page builds on this.

### Gotchas

- `a.cross(b)` overwrites `a` with the result, just like `sub`. Use `new Vector3().crossVectors(a, b)` to keep both inputs.
- Parallel inputs give (0, 0, 0), and normalizing that gives (0, 0, 0) too. It shows up with sliver triangles, whose edges almost line up, and later with `lookAt` when the forward and up directions line up.
- A triangle's area is half the cross product's length. `new Triangle(a, b, c).getArea()` does it for you.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
