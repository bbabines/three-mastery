---
id: 1.shaders.attributes-uniforms-varyings.read-the-code.1
loop: 1
tier: core
concepts: [shaders.attributes-uniforms-varyings]
mode: read-the-code
context: shaders.attributes-uniforms-varyings/color-gradient
lenses: []
misconceptions:
  - shaders.attributes-uniforms-varyings/copied-unchanged
---

# Attributes, uniforms, varyings

> **In short:** Shaders get three kinds of input: per-vertex data, single values from JavaScript, and values handed between shaders and blended on the way.
>
> **Used for:** Animating with time, smooth color gradients, wireframe overlays, and passing normals and UVs to every pixel.

## A · The basics

### Attributes and uniforms

An **attribute** is a value the geometry stores for every vertex: `position`, `normal`, `uv`, and any you add, like a `color`. Each run of the vertex shader reads its own vertex's values, and only the vertex shader can read attributes.

A **uniform** is one value for the whole draw call, set from JavaScript: the same for every vertex and every fragment. Time, a color picked in the UI, and a texture are all uniforms.

### Varyings: handed on, and blended

The fragment shader can't read attributes, so the vertex shader hands values on in a **varying**. A fragment sits between a triangle's three corners, so it gets a blend of all three values, weighted by how close it is to each. That blending is called **interpolation**, and it's why three colored corners give a smooth gradient.

**Analogy: weather stations.** A weather map has readings only at a few stations. A town between them gets a blend, and the nearer a station is, the more it counts.

Move the dot and watch its `vColor`. Then switch to `flat varying`, which turns the blending off.

<div data-scene="blend"></div>

<details>
<summary>The math, if you're curious</summary>

vColor = a × red + b × green + c × blue, where the three weights a, b, and c add up to 1. They're the spot's **barycentric coordinates**.

</details>

## B · Working knowledge

### Declaring each kind

Names must match exactly: the attribute's name in `setAttribute`, the uniform's key in `uniforms`, and a varying in both shaders. A uniform whose name doesn't match isn't an error; it just never gets your value.

```js
geometry.setAttribute('aHeat', new BufferAttribute(heat, 1)); // one float per vertex
```

```glsl
attribute float aHeat; // vertex shader only
uniform vec3 uTint;    // either shader
varying float vHeat;   // both: written in the vertex shader, read in the fragment shader
```

### Changing a uniform every frame

Set `value` on the material's own uniform, and three.js uploads it before the next draw. `{ value: time }` copies the number once, so changing `time` later does nothing. Try both buttons.

```js
const material = new ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader, fragmentShader });
material.uniforms.uTime.value = timer.getElapsed(); // in the frame loop
```

<div data-scene="clock"></div>

### Blended values need a second look

A varying keeps the space of whatever you wrote into it, but a normal blended between corners comes out shorter than 1, so call `normalize(vNormal)` again in the fragment shader. `flat varying vec3 vNormal;` turns blending off for that varying, which gives a faceted look.

### A wireframe from a blended value

Give each triangle's corners (1, 0, 0), (0, 1, 0), and (0, 0, 1), on a non-indexed geometry so no corner is shared. After blending, the smallest of the three is 0 on an edge:

```glsl
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z);
gl_FragColor = vec4(vec3(nearEdge < 0.03 ? 0.0 : 1.0), 1.0); // black lines on white
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
