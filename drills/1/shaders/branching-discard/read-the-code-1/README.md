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

> **In short:** A shader can take different paths with `if`, and a fragment shader can throw its fragment away with `discard`; both work, but neither is free.
>
> **Used for:** Holes in perforated panels, fences, and leaves; showing only the part of a model inside a mask, like a cross-section; switching an effect on for a selected part; and debug switches inside a shader.

## A · The basics

### if in a shader

`if` works the way it does in JavaScript. What it costs depends on whether neighboring pixels agree. As a rule of thumb, GPUs run the fragment shader for a group of neighboring pixels in lockstep, all doing the same step at the same time:

- When every pixel in the group takes the same side, only that side runs. An `if` on a uniform is always like this, because a uniform is the same for every pixel.
- When they disagree, the group runs both sides, one after the other, and each pixel keeps its own answer. The cost is both sides added together.

**Analogy: a tour bus.** If the whole group wants the museum, the bus goes to the museum. If half want the beach, the bus goes to both, and everyone sits through both stops.

### discard

`discard` throws the fragment away: it writes no color and no depth, so whatever is behind it shows through. That's how the pipeline stages page's `alphaTest` cuts holes. Setting the color's alpha to 0 isn't the same: on a material that isn't `transparent`, alpha is simply ignored.

Try both versions of the perforated panel, and change the hole size.

<div data-scene="cutout"></div>

## B · Working knowledge

### Cheap ifs and costly ones

```glsl
if (uSelected) color += uGlow;                 // a uniform: every pixel agrees, one side runs
if (vWorldPos.x > 0.0) color = marble(vWorldPos); // changes across the part: near x = 0,
else color = wood(vWorldPos);                     // neighbors can run both patterns
```

- Most small `if`s don't matter. The costly one has expensive work on both sides and a condition that changes from pixel to pixel.
- `step` and `mix` can replace an `if`, but they work out both sides too, so they aren't automatically faster.
- `#ifdef`, with `material.defines`, is decided before the shader compiles, so it costs nothing while drawing, but every combination is its own program to compile. Set `material.needsUpdate = true` after changing `defines`.

### Cutouts with discard

```js
new MeshStandardMaterial({ map: leaves, alphaTest: 0.5 }); // three.js adds the discard for you
```

```glsl
if (alpha < 0.5) discard; // the same, in your own shader
```

- A cutout stays an ordinary opaque material: it writes depth and needs no sorting, unlike `transparent: true` (the blending page).
- `discard` saves none of the work the shader did before it, and a shader that can discard can stop the GPU from skipping hidden fragments early. Many stacked cutout panels are a classic slow spot; the depth buffer and early-z page covers why.
- The shadow pass uses its own depth material. three.js carries `alphaTest` over to it for built-in materials with a `map` or `alphaMap`; a `discard` in your own shader needs a `customDepthMaterial` that discards too (the extending materials page).

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
