---
id: 1.math.dot-product.read-the-code.1
loop: 1
tier: core
concepts: [math.dot-product]
mode: read-the-code
context: math.dot-product/lambert
lenses: []
misconceptions:
  - math.dot-product/only-three-values
  - math.dot-product/always-unit-range
  - math.dot-product/acos-unclamped
---

# Dot product

> **In short:** One number that says how much two directions point the same way: 1 for the same way, 0 at right angles, −1 for opposite.
>
> **Used for:** Lighting a surface, front-or-behind checks, vision cones for game characters, and measuring the angle between any two directions.

## A · The basics

### How much do two directions agree?

The dot product takes two directions and gives back one number that says how much they point the same way:

- **1** means they point the same way.
- **0** means they're at right angles.
- **−1** means they point opposite ways.

Everything in between is a smooth scale, not just those three values. Directions a little apart give something like 0.9; further apart, 0.5; past a right angle, the number goes negative.

**Analogy: pushing a stalled car.** Push from directly behind and all your effort moves the car forward. Push from the side and none of it helps. Push from the front and you're working against it. Push at an angle and part of your effort counts. The dot product measures how much of one direction goes along the other.

Turn b with the slider and watch the number.

<div data-scene="agree"></div>

In three.js it's `a.dot(b)`. In shader code it's `dot(a, b)`.

<details>
<summary>The math, if you're curious</summary>

Multiply the matching parts and add them up: a.x × b.x + a.y × b.y + a.z × b.z. For (1, 0, 0) and (0, 1, 0), that's 0 + 0 + 0 = 0.

</details>

### Only for length-1 directions

The 1 to −1 scale holds only when both directions have length 1. Otherwise the answer is multiplied by both lengths, so it can be 10 or −20. Normalize first when you want the agreement score. The sign still tells you something either way: positive means partly the same way, and negative means partly opposite.

## B · Working knowledge

### In front or behind?

```js
const toTarget = target.position.clone().sub(guard.position);
const inFront = guardForward.dot(toTarget) > 0;
```

For front or behind, only the sign matters, so you don't need to normalize.

### Inside a vision cone?

Normalize, then compare against a threshold. `Math.cos` turns the cone's half-angle into that threshold; a 60° half-angle gives 0.5.

```js
const toTarget = target.position.clone().sub(guard.position).normalize();
const seen = guardForward.dot(toTarget) > Math.cos(MathUtils.degToRad(60)); // > 0.5
```

### Lighting in a shader

This is the dot product you'll see most. A surface is brightest when it faces the light directly and dark when it faces away:

```glsl
float light = max(dot(normal, toLight), 0.0);
```

`normal` is the direction the surface faces and `toLight` points at the light, both length 1. Facing the light gives 1, side-on gives 0, and facing away gives a negative number, which `max` clamps to 0 so nothing turns darker than black. Move the light around:

<div data-scene="lighting"></div>

### Getting the angle

To turn a dot product into an angle, use `a.angleTo(b)`, not `Math.acos(a.dot(b))`. Rounding can push a dot product to 1.0000000000000002, and `Math.acos` of anything over 1 is `NaN`. `angleTo` guards against that.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
