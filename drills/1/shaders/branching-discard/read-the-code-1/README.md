---
id: 1.shaders.branching-discard.read-the-code.1
loop: 1
tier: light
concepts: [shaders.branching-discard]
mode: read-the-code
context: shaders.branching-discard/alpha-cutout
lenses: []
misconceptions:
  - shaders.branching-discard/if-free
---

# Branching and discard

> **In short:** `if` lets a shader pick a path and `discard` throws a fragment away, and neither is as free as it looks.
>
> **Used for:** Holes in fences and leaves, cross-section masks, highlighting a selected part, and debug switches.

## A · The basics

### if in a shader

`if` works the way it does in JavaScript. What it costs depends on whether neighboring pixels agree, because the GPU usually runs the fragment shader for a small group of them in lockstep, all doing the same step at once. When the whole group takes the same side, only that side runs; an `if` on a uniform is always like that. When they disagree, the group runs both sides, one after the other.

**Analogy: a tour bus.** If the whole group wants the museum, the bus goes to the museum. If half want the beach, the bus goes to both, and everyone sits through both stops.

### discard

`discard` throws the fragment away: it writes no color and no depth, so whatever is behind it shows through. Setting the alpha to 0 isn't the same: on a material that isn't `transparent`, alpha is simply ignored.

Try both versions of the perforated panel, and change the hole size.

<div data-scene="cutout"></div>

## B · Working knowledge

### Cheap ifs and costly ones

Most small `if`s don't matter. The costly one has expensive work on both sides and a condition that changes from pixel to pixel:

```glsl
if (uSelected) color += uGlow;                    // a uniform: every pixel agrees, one side runs
if (vWorldPos.x > 0.0) color = marble(vWorldPos); // changes across the part: near x = 0,
else color = wood(vWorldPos);                     // neighbors can run both patterns
```

### Cutouts with discard

```js
new MeshStandardMaterial({ map: leaves, alphaTest: 0.5 }); // three.js adds the discard for you
```

```glsl
if (alpha < 0.5) discard; // the same, in your own shader
```

A cutout stays an ordinary opaque material: it writes depth and needs no sorting, unlike `transparent: true`. But `discard` saves none of the work done before it, and it can stop the GPU from skipping hidden fragments early, so many stacked cutout panels get slow.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
