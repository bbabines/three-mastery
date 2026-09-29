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

> **In short:** GLSL comes with a toolbox of small functions, like `mix`, `step`, `smoothstep`, `clamp`, and `fract`, that shaders combine to make patterns, edges, and fades without writing the math by hand.
>
> **Used for:** Stripes and hazard markings on a part; rings spreading out from a spot on the floor; soft fades like a spotlight's edge or a vignette; and blending two colors or textures by a mask.

## A · The basics

### A small toolbox does most of the work

Most shader effects are a handful of built-in functions chained together. They take floats or whole vectors; on a vector they work on each part separately.

| Function | Gives back | Typical use |
| --- | --- | --- |
| `mix(a, b, t)` | A blend from `a` (t = 0) to `b` (t = 1): the lerp page's lerp | Blending two colors by a mask |
| `clamp(x, lo, hi)` | `x`, kept between `lo` and `hi` | Keeping a value in 0 to 1 |
| `step(edge, x)` | 0 while `x` is below `edge`, 1 from `edge` up | A hard cut: on or off |
| `smoothstep(e0, e1, x)` | 0 below `e0`, 1 above `e1`, and a smooth S-curve between | A soft cut: a fade |
| `fract(x)` | The part after the decimal point, so it climbs 0 to 1 and starts over | Repeating patterns |
| `mod(x, y)` | Like `fract`, but repeating every `y` instead of every 1 | Repeating at any size |
| `dot(a, b)`, `reflect(i, n)` | The dot product page's dot product, and the reflection page's bounce | Lighting, reflections |

**Analogy: a light switch and a dimmer.** `step` is a switch: off, then on, with nothing between. `smoothstep` is a dimmer: you choose where the dimming starts and where it ends, and it fades smoothly between. They answer the same question, "how far past the line am I?", in two different ways.

Build a stripe in three steps. `fract` makes a ramp that repeats; `step` cuts it into hard stripes; `smoothstep` cuts it with a soft edge. Turn the panel away from you, and watch the hard edges break into jagged steps before the soft ones do.

<div data-scene="stripes"></div>

## B · Working knowledge

### Hard edge or soft edge

```glsl
float hard = step(0.5, f);            // 0 below 0.5, 1 from 0.5 up
float soft = smoothstep(0.4, 0.6, f); // 0 below 0.4, 1 above 0.6, a smooth fade between
```

- **They're not swappable.** `smoothstep` takes two edges, where the fade starts and where it ends; `step` takes one. Changing one word turns a working line into a compile error.
- **The edge comes first in `step`.** `step(edge, x)` reads "has `x` reached `edge`?". `step(x, edge)` gives the opposite answer, and it compiles fine.
- **`e0` must be less than `e1`.** The GLSL spec leaves `smoothstep(1.0, 0.0, x)` undefined, so to fade the other way, write `1.0 - smoothstep(0.0, 1.0, x)`.
- **A hard edge looks jagged.** Each pixel is either fully in or fully out, so a `step` edge shows stair-steps, and far away it shimmers. A fade about a pixel wide looks clean; the derivatives page sizes it to exactly one pixel.

### A fade with a mask

A mask is a value from 0 to 1 that says how much of an effect each spot gets. `smoothstep` makes it, and `mix` applies it. The rings spread out from the center, and the mask fades them out between the two distances you set:

```glsl
float d = distance(vWorldPos.xz, uCenter);
float rings = step(0.5, fract(d * 2.0 - uTime));
float mask = 1.0 - smoothstep(uInner, uOuter, d); // 1 inside uInner, 0 past uOuter
gl_FragColor = vec4(mix(uFloor, uGlow, rings * mask), 1.0);
```

<div data-scene="rings"></div>

`mix` with `t` outside 0 to 1 overshoots instead of stopping, so `clamp` it first when `t` can stray: `mix(a, b, clamp(t, 0.0, 1.0))`.

### mod isn't JavaScript's %

GLSL's `mod` always comes out with the same sign as the second number, so a pattern repeats smoothly across zero. JavaScript's `%` keeps the sign of the first:

```glsl
mod(-0.5, 2.0); // 1.5 in GLSL; -0.5 % 2 is -0.5 in JavaScript
```

It matters when a shader and your JavaScript both work out the same pattern, like which stripe the mouse is over.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
