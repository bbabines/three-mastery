---
id: 1.math.float-tolerance.read-the-code.1
loop: 1
tier: core
concepts: [math.float-tolerance]
mode: read-the-code
context: math.float-tolerance/vector-equality
lenses: []
misconceptions:
  - math.float-tolerance/equal-math-equal-floats
---

# Floating-point tolerance

> **In short:** Computers round numbers slightly, so compare "close enough" instead of exactly equal.
>
> **Used for:** Comparing positions and vectors, catching flat or broken triangles, "is this zero?" checks, and very large scenes.

## A · The basics

### Computers round

Try this in any browser console:

```js
0.1 + 0.2; // 0.30000000000000004
```

Computers store numbers with a limited number of digits, so almost every calculation rounds a tiny bit. Two results that should be equal often differ by a hair, and `===` says they're different.

**Analogy: a ruler with millimeter marks.** You can't record 3.25 mm on it; you write down the nearest mark. Two careful measurements of the same thing can land on neighboring marks.

### The fix: close enough

Instead of asking "are these equal?", ask "are these within a tiny amount of each other?" That tiny amount is the **tolerance**, often called epsilon.

```js
const same = Math.abs(a - b) < 1e-6;
```

### Bigger numbers, bigger gaps

The marks on the ruler aren't evenly spaced. Near 0 they're packed tightly; far from 0 they spread out. JavaScript's own numbers are very precise, but vertex data and the GPU use a smaller format, 32-bit floats, which runs out much sooner:

| Distance from the origin | Gap between storable float32 values |
| --- | --- |
| 1 | about 0.0000001 |
| 1,000 | about 0.00006 |
| 1,000,000 | about 0.06 |
| 10,000,000 | 1 |

Slide the sphere away from the origin. Its points are stored as float32, so far out they snap to the nearest value that can be stored, and the sphere crumples.

<div data-scene="precision"></div>

## B · Working knowledge

### Comparing vectors

`Vector3.equals` checks for exact equality, with no tolerance, so it fails on results that are equal in theory. Compare distances instead:

```js
const samePlace = p.distanceTo(q) < 1e-6;
```

In Vitest, `expect(x).toBeCloseTo(y, 6)` does about the same for numbers. The second argument is how many decimal places must match; leave it out and it's 2, which lets anything within 0.005 pass.

### Pick a tolerance that fits the numbers

1e-6 works for values around 1. For float32 positions around 5,000, the gap between storable values is about 0.0005, so a 1e-6 check only passes when the values are exactly equal: it's no better than `===`. The bigger the numbers, the bigger the tolerance you need.

### "Is it zero?" checks

The same goes for zero. A nearly flat triangle has a tiny area, not exactly 0, and nearly parallel directions have a tiny cross product. Check against a small tolerance:

```js
if (new Triangle(a, b, c).getArea() < 1e-10) skipDegenerate();
```

### Huge worlds

Geometry whose own vertex numbers are huge crumples, like the sphere above. An ordinary mesh moved far away with `position` holds up better: three.js combines the object's placement with the camera's in JavaScript's precise numbers, so the GPU only gets the small difference. Shader math done in world space and many physics engines still lose precision far out. When a scene spans kilometers, keep what's near the camera near the origin: move the world around the camera instead of moving the camera far away.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
