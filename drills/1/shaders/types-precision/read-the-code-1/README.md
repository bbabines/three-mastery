---
id: 1.shaders.types-precision.read-the-code.1
loop: 1
tier: light
concepts: [shaders.types-precision]
mode: read-the-code
context: shaders.types-precision/compile-errors
lenses: []
misconceptions:
  - shaders.types-precision/int-is-float
---

# Types and precision

> **In short:** GLSL never mixes whole numbers with decimals, so `1` isn't `1.0`, and a decimal gets less exact the bigger it grows.
>
> **Used for:** Fixing compile errors, animations that stutter after days open, banding on phones, and jitter far from the origin.

## A · The basics

### Whole numbers and decimals don't mix

JavaScript has one kind of number. GLSL has two: an `int` is a whole number, written without a decimal point (`1`, `-3`), and a `float` has one (`1.0`, `0.5`). GLSL never converts between them for you, so mixing them is a compile error:

```glsl
float a = 1;                  // error: 1 is an int
vec3 c = color * 2;           // error: a vec3 times an int
float b = 1.0;                // fine
float d = float(count) / 2.0; // fine: float() converts on purpose
```

Math on two ints stays whole, so `3 / 2` is 1, not 1.5.

**Analogy: metric and imperial bolts.** A 10 mm nut and a 3/8-inch bolt are almost the same size, but they won't go together. You need matching parts or an adapter, and in GLSL the adapter is `float()` or `int()`.

### How finely a float can tell numbers apart

As on the floating-point tolerance page, a GPU float keeps about seven significant digits, so the bigger a number gets, the bigger the gap to the next one it can hold. Near 1 the gap is tiny; near ten days in seconds, it's 0.0625.

Pick how long the page has been open. After a few days, the ball jumps instead of gliding; keep the number small in JavaScript, and it glides again.

<div data-scene="clock"></div>

## B · Working knowledge

### Choosing precision

three.js starts every `ShaderMaterial` with `precision highp float`, which means 32-bit floats. You can ask for less:

```js
new WebGLRenderer({ precision: 'mediump' }); // for every material
material.precision = 'mediump';              // for one material
```

`mediump` is only promised about three significant digits. Desktop GPUs usually run it at full 32 bits anyway, so its banding and jumps tend to show up only on phones. It's fine for colors; positions, big UVs, and time want `highp`.

### Keeping numbers small

Wrap time in JavaScript, whose numbers are 64-bit, before it goes to the GPU:

```js
material.uniforms.uTime.value = elapsed % period; // period: how often the effect repeats
```

Far from the origin, `modelViewMatrix` is worked out on the CPU in 64-bit numbers, so it holds only the small offset from the camera. Use it rather than `viewMatrix * modelMatrix`, which wobbles.

### When it doesn't compile

three.js logs the error to the console, with the shader lines around it, and the mesh doesn't show up.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
