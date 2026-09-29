---
id: 1.debugging.shader-errors.read-the-code.1
loop: 1
tier: light
concepts: [debugging.shader-errors]
mode: read-the-code
context: debugging.shader-errors/typos
lenses: []
misconceptions:
  - debugging.shader-errors/line-number
---

# Shader errors

> **In short:** When a shader doesn't compile, three.js logs the GPU driver's message along with the lines around the error, and its line numbers count the whole shader three.js built, with dozens or thousands of lines of its own around yours, so find the error by the code shown, not by counting lines in your file.
>
> **Used for:** A typo in a `ShaderMaterial`; a mistake in an `onBeforeCompile` patch to a built-in material; a whole number where GLSL wants a decimal; and catching compile errors in your own error reporting instead of the console.

## A · The basics

### What three.js prints

A shader is compiled by the GPU driver, the software that runs the graphics card, the first time a material is used. When it fails, that material doesn't draw, everything else carries on, and three.js logs `THREE.WebGLProgram: Shader Error` with three things in it:

- the material's `name` and type;
- the driver's message, like `ERROR: 0:58: 'colr' : undeclared identifier`, where 58 is the line;
- twelve lines of the shader around the error, with the failing line marked `>`.

The wording of the driver's message depends on the browser; the examples here are Chrome's.

### The line number counts three.js's code too

three.js doesn't compile your shader as you wrote it. It puts its own code in front: a version line, precision settings, `#define`s, and the uniforms and attributes every shader gets, like `modelMatrix` and `position`. In the scene below, that's more than 50 lines in front of a `ShaderMaterial`'s fragment shader. An `onBeforeCompile` patch lands inside a built-in material's shader, whose `#include` lines three.js expands first, so its errors report line numbers in the thousands.

So "line 58" isn't line 58 of your code. Read the line the log marks with `>`, and search your code for it.

**Analogy: a letter printed below a long letterhead.** "The typo is on line 30" counts from the top of the page, letterhead included. Find the sentence by its words, not by counting down your draft.

The broken versions only compile when you press their buttons, and the scene catches each log with `renderer.debug.onShaderError`, so it shows in the readout instead of the console.

<div data-scene="compileLog"></div>

## B · Working knowledge

### Catching the log yourself

```js
renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
  const message = gl.getShaderInfoLog(fragmentShader); // the driver's message
  const source = gl.getShaderSource(fragmentShader);   // the whole shader, three.js's lines included
  report(message, source);
};
```

Setting `onShaderError` replaces three.js's own report: nothing reaches the console unless your function logs it. `renderer.debug.checkShaderErrors`, on by default, turns the checking on or off; the docs suggest turning it off in production for speed, and keeping it on while developing, because with it off a broken shader fails without a word from three.js.

### onBeforeCompile mistakes

```js
material.onBeforeCompile = (shader) => {
  shader.uniforms.tint = { value: new Color('orange') };
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform vec3 tint;')
    .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= tint;');
};
```

- **A value used but never declared,** like `tint` without its `uniform vec3 tint;` line, is a compile error, reported deep inside the built-in shader.
- **A `replace` that finds nothing** fails silently: a chunk name spelled wrong leaves the shader unchanged, so the patch never runs and nothing is logged. The extending materials page covers where to hook in.

### Whole numbers and decimals

GLSL doesn't turn a whole number into a decimal for you: `float glow = 1;` fails with "cannot convert from 'const int' to 'highp float'". Write `1.0`. The types and precision page covers it; the shaders domain's debug output page covers the next step, seeing a shader's values once it compiles.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
