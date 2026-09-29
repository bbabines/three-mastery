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

> **In short:** Some inputs have no sensible answer, like the direction of a zero-length vector or the inverse of a zero scale; three.js's own math quietly hands back a fallback, but your own math can make NaN, "not a number", which then spreads to everything computed from it without a single error.
>
> **Used for:** An object that vanishes for no visible reason; a model that explodes into spikes after a vertex edit; a click that misses something plainly on screen; and a follower, camera, or aim that breaks the moment two things line up.

## A · The basics

### Questions with no answer

Which way does a vector of length 0 point? What undoes a scale of 0, which squashes everything flat? These are **degenerate cases**: inputs where the math has no sensible answer. three.js's own methods pick a fallback and carry on:

| Case | three.js gives back | What you see |
| --- | --- | --- |
| `new Vector3(0, 0, 0).normalize()` | (0, 0, 0) | Whatever uses it moves nowhere (the normalize page) |
| `lookAt` a point straight above or below | A nudged direction, with a roll it had to pick | A sudden spin (the lookAt page) |
| `invert()` a matrix with a scale of 0 | All zeros | Raycasts miss it, and `worldToLocal` gives NaN |
| `ray.intersectPlane` with a ray running along the plane | `null` | A drag on that plane stops |

None of them throws an error.

### NaN spreads

Your own math can do what three.js avoids. `0 / 0`, `Math.acos(1.0000000000000002)`, and `Math.sqrt(-1)` all give **NaN**, "not a number", and JavaScript doesn't throw for any of them. The dot product page showed how rounding can push a dot product of two unit vectors a hair over 1, which is exactly what makes `Math.acos` return NaN; the float tolerance page explains the rounding.

Worse, NaN spreads. Any math with NaN in it gives NaN: a NaN position makes a NaN `matrixWorld`, which makes every child NaN, which makes their bounds and every raycast against them NaN. Nothing fails loudly; things just vanish.

**Analogy: a drop of ink in a glass of water.** One drop, and the whole glass is ink. Pouring in more clean water never brings it back.

The yellow ball follows the red one, slowing on its last step so it lands right on it. The first button works out the direction with its own division, `toTarget.divideScalar(toTarget.length())`; the second uses `normalize()`. Let the ball arrive with each. Once it's there, the distance is 0, and 0 / 0 is NaN; multiplying by a speed of 0 doesn't help, because NaN times anything is NaN.

<div data-scene="follower"></div>

## B · Working knowledge

### Finding where NaN starts

```js
Number.isNaN(ship.position.x);                  // true when it's NaN
ship.matrixWorld.elements.some(Number.isNaN);   // any NaN in the transform
```

`ship.position.x === NaN` is always `false`: NaN isn't equal to anything, itself included. Once you find a NaN, log the inputs of the line that made it, and walk back until the inputs are all numbers. Saved data can carry it too: `JSON.stringify` writes NaN as `null`.

### Guarding your own math

```js
const angle = a.angleTo(b);                         // clamps first: never NaN
const risky = Math.acos(a.dot(b));                  // NaN when the dot is a hair over 1
if (toTarget.lengthSq() > 1e-12) toTarget.normalize(); // skip the degenerate case
```

Reach for three.js's methods where it has one, since they already handle the degenerate case. In your own formulas, clamp before `Math.acos` and `Math.asin` (`MathUtils.clamp(x, -1, 1)`), and check before dividing by a length.

### What NaN breaks downstream

- **Vanishing objects:** a mesh with NaN in its transform still passes the frustum check, since every comparison with NaN is false, and then draws nothing, as a rule of thumb, because its corners are NaN on the GPU.
- **Failed raycasts:** `raycaster.intersectObject` against it returns a hit for every triangle, each with a NaN `distance` and `point`, and the hits can sort first. A click lands on nothing, or on NaN.
- **Exploded geometry:** NaN in vertex positions is the one case three.js reports, with `computeBoundingSphere(): Computed radius is NaN` in the console (the nothing-renders checklist page).
- **In a shader,** `normalize(vec3(0.0))` is undefined in GLSL, and in practice it often gives NaN pixels, black or garbage. The shaders domain covers guarding against it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
