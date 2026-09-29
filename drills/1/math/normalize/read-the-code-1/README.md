---
id: 1.math.normalize.read-the-code.1
loop: 1
tier: light
concepts: [math.normalize]
mode: read-the-code
context: math.normalize/target-direction
lenses: []
misconceptions:
  - math.normalize/always-normalize
  - math.normalize/zero-vector
---

# Normalize

> **In short:** Keeps a vector's direction and sets its length to 1, so it says only "which way".
>
> **Used for:** Aiming and moving at a set speed, the direction a surface faces, ray directions, and anything the dot product compares.

## A · The basics

### Which way, not how far

Sometimes you only care which way something points, not how far it goes. **Normalizing** keeps a vector's direction and sets its length to exactly 1. A vector with length 1 is called a **unit vector**.

```js
const dir = new Vector3(3, 0, -4).normalize(); // (0.6, 0, -0.8), length 1
```

**Analogy: a compass needle.** The needle shows which way north is. It's the same size whether north is one step away or a thousand miles.

Move the target with the sliders. The yellow arrow reaches the target. The green arrow is the same direction normalized: its tip always lands on the ring, because the ring is 1 unit from the center.

<div data-scene="compass"></div>

### Why length 1 matters

Lots of code expects its directions to have length 1: lighting and raycasting give wrong answers otherwise, and the dot product can't be read as a −1 to 1 score. A unit direction also makes speed simple: multiply it by how far you want to go.

## B · Working knowledge

### Aim, then move at a speed

The most common pattern in 3D code: get the move toward a target, normalize it, then scale it by speed.

```js
const dir = target.position.clone().sub(ship.position).normalize();
ship.position.addScaledVector(dir, speed * delta); // delta: seconds since the last frame
```

Without `normalize()`, the ship would move faster the farther away the target is.

### When not to normalize

"Always normalize" is a myth. Normalizing throws the length away, so don't do it to anything whose length matters: a velocity (its length is the speed), an offset, or a distance.

Many three.js methods already hand you unit directions, including `camera.getWorldDirection()`, a ray from `raycaster.setFromCamera()`, and `hit.face.normal` from a raycast (which is measured in the object's own space, not the world).

### The zero vector

(0, 0, 0) has no direction to keep. three.js doesn't throw an error when you normalize it; it quietly returns (0, 0, 0). That happens when an object is exactly at its target: the "direction" is zero, and whatever uses it moves nowhere or aims strangely. Check first when it can happen:

```js
if (toTarget.lengthSq() > 0) toTarget.normalize();
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
