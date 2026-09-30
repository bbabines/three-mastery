---
id: 1.debugging.nan-degenerate.read-the-code.1
loop: 1
tier: light
concepts: [debugging.nan-degenerate]
mode: read-the-code
context: debugging.nan-degenerate/vanishing
lenses: []
misconceptions:
  - debugging.nan-degenerate/nan-throws
---

# NaN and degenerate cases

> **In short:** When the math has no sensible answer, three.js returns a fallback and carries on, but a NaN from your own math spreads silently.
>
> **Used for:** Objects that vanish, models that explode into spikes, clicks that miss, and aims that break when two things line up.

## A · The basics

### Questions with no answer

Which way does a vector of length 0 point? What undoes a scale of 0, which squashes everything flat? These are **degenerate cases**: inputs with no sensible answer. three.js's own methods return a fallback and carry on, with no error:

| Case | What three.js does |
| --- | --- |
| `new Vector3(0, 0, 0).normalize()` | Returns (0, 0, 0), so whatever uses it stays put |
| `lookAt` a point straight above | Picks a roll, so it can suddenly spin |
| `invert()` a matrix with a scale of 0 | Returns all zeros, so raycasts miss the object |
| `ray.intersectPlane` along the plane | Returns `null`, so a drag stops |

### NaN spreads

Your own math can do what three.js avoids. `0 / 0`, `Math.acos(1.0000000000000002)`, and `Math.sqrt(-1)` all give **NaN**, "not a number", and JavaScript throws for none of them. Worse, any math with NaN in it gives NaN: a NaN position makes a NaN `matrixWorld`, then NaN children, then NaN raycast hits. Nothing fails loudly; things just vanish.

**Analogy: a drop of ink in a glass of water.** One drop, and the whole glass is ink. Pouring in more clean water never brings it back.

A follower that divides by its own distance makes NaN the moment it arrives, since the distance is then 0. Let the yellow ball catch the red one with each button, and watch the readout.

<div data-scene="follower"></div>

## B · Working knowledge

### Finding where NaN starts

```js
Number.isNaN(ship.position.x);                // true when it's NaN
ship.matrixWorld.elements.some(Number.isNaN); // any NaN in the transform
```

`ship.position.x === NaN` is always `false`: NaN isn't equal to anything, itself included. Once you find a NaN, log the inputs of the line that made it, and walk back until they're all numbers.

### Guarding your own math

```js
const angle = a.angleTo(b);                            // clamps first: never NaN
const risky = Math.acos(a.dot(b));                     // NaN when the dot is a hair over 1
if (toTarget.lengthSq() > 1e-12) toTarget.normalize(); // skip the degenerate case
```

Use three.js's method where there is one. In your own formulas, clamp before `Math.acos` and `Math.asin` (`MathUtils.clamp(x, -1, 1)`), and check before dividing by a length.

### What NaN breaks

A mesh with NaN in its transform still passes the frustum check, since every comparison with NaN is false, and then usually draws nothing. A raycast against it returns a hit for every triangle, each at a NaN distance. NaN in vertex positions is the one case three.js reports, with `Computed radius is NaN` in the console.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
