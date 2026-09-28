---
id: 1.math.lerp.read-the-code.1
loop: 1
tier: light
concepts: [math.lerp]
mode: read-the-code
context: math.lerp/positions
minutes: 8
lenses: []
misconceptions:
  - math.lerp/stays-unit
  - math.lerp/t-in-range
---

# Lerp

## A · The basics

### Blending between two things

**Lerp** (short for linear interpolation) gives you a value partway between a start and an end. A number called `t` says how far: 0 is the start, 1 is the end, and 0.5 is halfway.

```js
const middle = a.clone().lerp(b, 0.5);
```

It works on anything made of numbers: positions, colors, sizes, volumes.

**Analogy: a dimmer switch.** All the way down is one setting, all the way up is the other, and everything between is a blend.

Drag `t`. The ball moves between A and B and its color blends too. Then push `t` below 0 or above 1.

<div data-scene="blend"></div>

### Outside 0 to 1

Lerp doesn't stop at the ends. `t` = 1.5 goes past B by half the distance again, and a negative `t` goes back past A.

## B · Working knowledge

### Where you'll see it

| Code | Blends |
| --- | --- |
| `a.clone().lerp(b, t)` | Two vectors, often positions |
| `a.lerpVectors(start, end, t)` | Writes the blend into `a` |
| `color.lerpColors(red, blue, t)` | Two colors |
| `MathUtils.lerp(x, y, t)` | Two plain numbers |
| `mix(a, b, t)` | Anything, in shader code |

### Keep t in range when overshooting is wrong

If `t` comes from something that can overshoot, like a drag distance or a timer, clamp it:

```js
const t = MathUtils.clamp(elapsed / duration, 0, 1);
```

### Blending directions shortens them

Halfway between two length-1 directions is shorter than 1, and halfway between two opposite directions is (0, 0, 0). Normalize after blending directions. For rotations, use `slerp`, which the rotation domain covers.

### Easing toward a target

This common line moves an object a tenth of the remaining way every frame, so it slows down as it arrives:

```js
mesh.position.lerp(target, 0.1);
```

It runs faster on a 120 Hz screen than on a 60 Hz one; the interaction domain shows the fix.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
