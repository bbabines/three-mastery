---
id: 1.shaders.debug-output.read-the-code.1
loop: 1
tier: core
concepts: [shaders.debug-output]
mode: read-the-code
context: shaders.debug-output/verify-spaces
lenses: []
misconceptions:
  - shaders.debug-output/final-color-only
---

# Debug output

> **In short:** Shaders can't print, so you show a hidden value by painting it as the color and reading it off the screen.
>
> **Used for:** Checking normals and their space, finding UV seams and stretching, checking depth, and inspecting any mask or blend.

## A · The basics

### Paint the value

A fragment shader's only output is a color, but a color is just three numbers from 0 to 1. So any value can be shown by putting it in the color for a moment, instead of the real result:

```glsl
gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0); // a direction, as a color
```

Map the value into 0 to 1 first. A direction runs from −1 to 1, and `* 0.5 + 0.5` squeezes it in. Then read the colors like the axes helper: red is X, green is Y, and blue is Z, so a normal pointing straight up shows as a light green.

**Analogy: a thermal camera.** You can't see heat, so a thermal camera paints temperature as color. A debug view does the same for numbers you can't see.

Try each view: orbit, then turn the part. `MeshNormalMaterial`'s colors change as you orbit, and the world normals' only as the part turns.

<div data-scene="normals"></div>

## B · Working knowledge

### Recipes

```glsl
gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0); // a normal: -1 to 1 becomes 0 to 1
gl_FragColor = vec4(vUv, 0.0, 1.0);                       // UVs: red across, green up
gl_FragColor = vec4(fract(vWorldPos), 1.0);               // a position: repeats every unit
gl_FragColor = vec4(vec3(step(0.0, uValue)), 1.0);        // a sign test: white at 0 or above
```

Show one value at a time, behind a switch on a uniform. All black or all white means the value left 0 to 1 and got clipped, so remap it or show its `fract`. To read exact numbers with a color picker, leave out `#include <colorspace_fragment>`: with it, 0.5 shows as 188 out of 255, not 128.

### Normals: which space?

```js
mesh.material = new MeshNormalMaterial(); // normals measured from the camera
```

Its colors change as you orbit, because it uses `normalMatrix`; that's right, not a bug. To check world normals, use a small shader with `vWorldNormal = normalize(mat3(modelMatrix) * normal);`.

### UVs and depth

Switch views. A hard jump in the UV colors is a **seam**, where the texture's edges meet, and a checker shows stretching. `gl_FragCoord.z` shows nearly everything white, because depth isn't spread evenly, so show how far in front of the camera instead:

<div data-scene="views"></div>

```glsl
vViewZ = -(modelViewMatrix * vec4(position, 1.0)).z;              // vertex shader: how far in front of the camera
gl_FragColor = vec4(vec3((vViewZ - uNear) / (uFar - uNear)), 1.0); // black at uNear, white at uFar
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
