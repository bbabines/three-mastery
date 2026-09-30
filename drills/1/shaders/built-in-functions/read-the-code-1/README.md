---
id: 1.shaders.built-in-functions.read-the-code.1
loop: 1
tier: core
concepts: [shaders.built-in-functions]
mode: read-the-code
context: shaders.built-in-functions/stripes
lenses: []
misconceptions:
  - shaders.built-in-functions/step-smoothstep
---

# Built-in functions

> **In short:** GLSL has ready-made functions for blends, cutoffs, fades, and repeats, and most shader effects are a few of them chained together.
>
> **Used for:** Stripes and hazard markings, rings spreading across a floor, soft spotlight edges, and blending colors by a mask.

## A · The basics

### A small toolbox does most of the work

You rarely write the math of a shader effect by hand. You chain a handful of built-in functions. Each takes a float or a whole vector, and on a vector it works on each part separately.

| Function | Gives back |
| --- | --- |
| `mix(a, b, t)` | A blend from `a` to `b`, like lerp |
| `clamp(x, lo, hi)` | `x`, kept between `lo` and `hi` |
| `step(edge, x)` | 0 below `edge`, 1 from `edge` up: a hard cut |
| `smoothstep(e0, e1, x)` | 0 below `e0`, 1 above `e1`, and a smooth fade between |
| `fract(x)` | The part after the decimal point: 0 to 1, over and over |
| `mod(x, y)` | Like `fract`, but repeating every `y` |

**Analogy: a light switch and a dimmer.** `step` is a switch: off, then on, with nothing between. `smoothstep` is a dimmer that fades between two points you choose.

Build a stripe in three steps with the buttons, then turn the panel away from you. The hard edges break into jagged steps before the soft ones do.

<div data-scene="stripes"></div>

## B · Working knowledge

### Hard edge or soft edge

```glsl
float hard = step(0.5, f);            // 0 below 0.5, 1 from 0.5 up
float soft = smoothstep(0.4, 0.6, f); // 0 below 0.4, 1 above 0.6, a fade between
```

They aren't swappable: `smoothstep` takes two edges and `step` takes one, so swapping the word breaks the compile. In `step` the edge comes first; `step(x, edge)` gives the opposite answer, and still compiles. Keep `smoothstep`'s first edge below its second, and to fade the other way, write `1.0 - smoothstep(0.0, 1.0, x)`.

### A fade with a mask

A mask is a value from 0 to 1 that says how much of an effect each spot gets. `smoothstep` makes it, and `mix` applies it:

```glsl
float rings = step(0.5, fract(d * 2.0 - uTime));  // d: the distance from the center
float mask = 1.0 - smoothstep(uInner, uOuter, d); // 1 inside uInner, 0 past uOuter
gl_FragColor = vec4(mix(uFloor, uGlow, rings * mask), 1.0);
```

Move where the fade starts and ends.

<div data-scene="rings"></div>

### mod isn't JavaScript's %

GLSL's `mod` always has the sign of the second number, so a pattern repeats smoothly across zero. JavaScript's `%` keeps the sign of the first:

```glsl
mod(-0.5, 2.0); // 1.5 in GLSL; -0.5 % 2 is -0.5 in JavaScript
```

It matters when a shader and your JavaScript work out the same pattern, like which stripe the mouse is over.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
