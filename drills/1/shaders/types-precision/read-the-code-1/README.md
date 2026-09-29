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

> **In short:** GLSL is strict about kinds of numbers, so `1` (a whole number) and `1.0` (a decimal) don't mix, and every decimal has a precision that limits how finely it can tell nearby numbers apart.
>
> **Used for:** Fixing "cannot convert" compile errors; an animation that starts to stutter after a kiosk page has been open for days; color banding that only shows up on some phones; and parts that wobble when they're far from the origin.

## A · The basics

### Whole numbers and decimals don't mix

JavaScript has one kind of number. GLSL has two: an `int` is a whole number, written without a decimal point (`1`, `-3`), and a `float` has one (`1.0`, `0.5`). GLSL never converts between them for you, so mixing them is a compile error:

```glsl
float a = 1;                  // error: 1 is an int
float b = 1.0;                // fine
vec3 c = color * 2;           // error: a vec3 times an int
float d = float(count) / 2.0; // fine: float() converts on purpose
```

Math on two ints stays whole, so `3 / 2` is 1, not 1.5.

**Analogy: metric and imperial bolts.** A 10 mm nut and a 3/8-inch bolt are almost the same size, but they won't go together. You use matching parts, or an adapter; in GLSL, the adapter is `float()` or `int()`.

### Precision: how finely a float can tell numbers apart

The floating-point tolerance page showed that a 32-bit float keeps about seven significant digits, so the bigger a number gets, the bigger the gap to the next number it can hold. Near 1 the gap is tiny. Near 864,000, which is ten days in seconds, it's 0.0625.

A time uniform keeps growing for as long as the page is open. The ball is moved in the vertex shader by `sin` and `cos` of `uTime`. Pick how long the page has been open: after a few days, the time the GPU gets moves in visible jumps, and so does the ball. Then keep the number small in JavaScript, and it glides again.

<div data-scene="clock"></div>

## B · Working knowledge

### Choosing precision

three.js starts every `ShaderMaterial` with `precision highp float;`, which means 32-bit floats. You can ask for less:

```js
new WebGLRenderer({ precision: 'mediump' }); // for every material
material.precision = 'mediump';              // for one material
```

The GLSL spec only promises `mediump` a range of about ±16,384 and roughly three significant digits. As a rule of thumb, desktop GPUs run it at full 32 bits anyway, so `mediump` problems tend to show up only on phones: smooth gradients that step into visible bands, and positions or time that jump. It's fine for colors; positions, UVs on big textures, and time want `highp`.

### Keeping numbers small

- **Time:** wrap it in JavaScript, whose numbers are 64-bit, before it goes to the GPU: `uTime.value = elapsed % period`, where `period` is how often the effect repeats.
- **Far from the origin:** three.js works out `modelViewMatrix` on the CPU with 64-bit numbers, so it holds the object's small offset from the camera. `modelMatrix` holds the big world position, rounded to 32 bits on the GPU. For a part 100 km from the origin, seen up close, `modelViewMatrix * vec4(position, 1.0)` stays steady, and `viewMatrix * modelMatrix * vec4(position, 1.0)` wobbles.

### When it doesn't compile

three.js logs the error to the console, with the lines of the shader around it, and the mesh doesn't show up. The shader errors page in the debugging domain covers reading those messages.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
