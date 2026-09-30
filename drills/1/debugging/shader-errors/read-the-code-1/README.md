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

> **In short:** A shader error's line number counts the whole shader three.js built, so find the mistake by the code shown, not the number.
>
> **Used for:** Typos in a `ShaderMaterial`, broken `onBeforeCompile` patches, whole numbers where GLSL wants decimals, and your own error reports.

## A · The basics

### What three.js prints

A shader is compiled by **the driver**, the software that runs the graphics card, the first time a material is used. When it fails, that material doesn't draw and everything else carries on. three.js logs `THREE.WebGLProgram: Shader Error` with the material's name, the driver's message, and the lines around the error, the failing one marked `>`:

```
ERROR: 0:58: 'colr' : undeclared identifier
```

### The line number counts three.js's code too

three.js doesn't compile your shader as you wrote it. It puts its own code in front: a version line, precision settings, `#define`s, and the uniforms and attributes every shader gets, like `modelMatrix` and `position`. An `onBeforeCompile` patch lands inside a built-in material's whole shader, so its errors report line numbers in the thousands.

So "line 58" isn't line 58 of your code. Read the line the log marks with `>`, and search your code for it.

**Analogy: a letter printed below a long letterhead.** "The typo is on line 30" counts from the top of the page, letterhead included. Find the sentence by its words instead.

Press each broken version, and compare the line number in its log with where the line sits in your code.

<div data-scene="compileLog"></div>

## B · Working knowledge

### Catching the log yourself

```js
renderer.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
  const message = gl.getShaderInfoLog(fragmentShader); // the driver's message
  report(message, gl.getShaderSource(fragmentShader)); // with the whole shader
};
```

Setting `onShaderError` replaces three.js's own report, so nothing reaches the console unless your function logs it. Keep `renderer.debug.checkShaderErrors` on while developing: with it off, a broken shader fails without a word from three.js.

### onBeforeCompile mistakes

Inside `material.onBeforeCompile = (shader) => { … }`, a patch declares its uniform and then uses it:

```js
shader.uniforms.tint = { value: new Color('orange') };
shader.fragmentShader = shader.fragmentShader
  .replace('#include <common>', '#include <common>\nuniform vec3 tint;')
  .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= tint;');
```

Leave out the `uniform vec3 tint;` line and it's a compile error, reported deep inside the built-in shader. A `replace` that finds nothing fails silently: a misspelled chunk name leaves the shader unchanged, and nothing is logged.

### Whole numbers and decimals

GLSL doesn't turn a whole number into a decimal for you: `float glow = 1;` fails with "cannot convert from 'const int' to 'highp float'". Write `1.0`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
