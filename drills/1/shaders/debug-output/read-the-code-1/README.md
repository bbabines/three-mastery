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

> **In short:** A shader has no `console.log`, so to see any value inside it, you write that value out as the color, and read it off the screen.
>
> **Used for:** Checking that normals point the way, and live in the space, you think; finding UV seams and stretched textures on a model; seeing whether depth spreads across the range you expect; and checking any mask, distance, or blend an effect depends on.

## A · The basics

### Paint the value

A fragment shader's only output is a color, but a color is just three numbers from 0 to 1. So any value can be shown by putting it in the color for a moment, instead of the real result:

```glsl
gl_FragColor = vec4(normalize(vWorldNormal) * 0.5 + 0.5, 1.0); // a direction, as a color
```

The screen can only show 0 to 1, so map the value into that range first. A direction runs from −1 to 1, and `* 0.5 + 0.5` squeezes it into 0 to 1. Then read the colors like the axes helper: red is X, green is Y, blue is Z. A normal pointing straight up, (0, 1, 0), shows as (0.5, 1, 0.5), a light green.

**Analogy: a thermal camera.** You can't see heat, so a thermal camera paints temperature as color. A debug view does the same for numbers you can't see.

The same little assembly, three ways. Orbit around it, then turn it. `MeshNormalMaterial` shows normals measured from the camera, so its colors change as you orbit. The world-normal shader's colors stay put as you orbit, and change only when the part turns. Leave out the `* 0.5 + 0.5`, and everything facing a negative direction goes black.

<div data-scene="normals"></div>

## B · Working knowledge

### Recipes

```glsl
gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);  // a normal: -1 to 1 becomes 0 to 1
gl_FragColor = vec4(vUv, 0.0, 1.0);                        // UVs: red across, green up
gl_FragColor = vec4(fract(vWorldPos), 1.0);                // a position: repeats every unit
gl_FragColor = vec4(vec3(step(0.0, uValue)), 1.0);         // a sign test: white at 0 or above, black below
```

- Show one value at a time, and keep a switch for it: `if (uDebug == 1) gl_FragColor = …;` on a uniform is cheap (the branching and discard page).
- All black or all white means the value is outside 0 to 1 and got clipped. Remap it, or show `fract` of it.
- To read exact numbers with a color picker, leave out `#include <colorspace_fragment>`: it converts for the screen, so 0.5 shows as 188 out of 255, not 128. `MeshNormalMaterial` leaves it out for that reason.

### Normals: which space?

```js
mesh.material = new MeshNormalMaterial(); // normals measured from the camera
```

It's the quickest debug view, and its colors change as you orbit, because it uses `normalMatrix`. That's right, not a bug. To check world normals, use a small shader: `vWorldNormal = normalize(mat3(modelMatrix) * normal);` in the vertex shader.

### UVs and depth

Switch views. UVs as color show the layout: a hard jump from one color to another is a **seam**, where the texture's edges meet, and a checker made from the UVs shows stretching and pinching. `gl_FragCoord.z` shows nearly everything as white: depth isn't spread evenly, as the depth precision page showed. For a readable picture, show the distance from the camera across a range you choose.

<div data-scene="views"></div>

```glsl
vViewZ = -(modelViewMatrix * vec4(position, 1.0)).z;              // vertex shader: how far in front of the camera
gl_FragColor = vec4(vec3((vViewZ - uNear) / (uFar - uNear)), 1.0); // black at uNear, white at uFar
```

The debug views page in the debugging domain covers the ready-made versions: wireframe, `MeshDepthMaterial`, and a UV checker texture.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
