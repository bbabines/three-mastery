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

> **In short:** A shader gets its inputs three ways: attributes are values stored for each vertex, uniforms are single values your JavaScript sets for the whole draw, and varyings are values the vertex shader hands on to the fragment shader, blended across each triangle.
>
> **Used for:** Animating an effect with a time value from JavaScript; smooth color gradients from a few colored corners; drawing a wireframe over a model; and passing normals and UVs along so lighting and textures work at every pixel.

## A · The basics

### Attributes: one value for each vertex

An **attribute** is a value the geometry stores for every vertex, in a `BufferAttribute` like the ones on the BufferAttribute and itemSize page: `position`, `normal`, `uv`, and any you add yourself, like a `color`. Each run of the vertex shader reads the values for its own vertex. Only the vertex shader can read attributes.

### Uniforms: one value for everything

A **uniform** is one value your JavaScript hands to the whole draw call: the same for every vertex and every fragment. Time, a color picked in the UI, a light's direction, and a texture are all uniforms. You declare it in both places, with the same name:

```js
const material = new ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader, fragmentShader });
```

```glsl
uniform float uTime; // in whichever shader uses it
```

The `u` in front is only a habit that makes uniforms easy to spot, like `a` for your own attributes and `v` for varyings.

### Varyings: handed on, and blended

The fragment shader can't read attributes, so the vertex shader hands values on. It writes a **varying**, and the fragment shader reads it:

```glsl
varying vec3 vColor; // declared the same way in both shaders
vColor = color;      // vertex shader: one value at each corner
```

A fragment sits somewhere inside a triangle, between three corners, so it doesn't get one corner's value. It gets a blend of all three, weighted by how close it is to each: right on a corner, that corner's value; in the middle, an even mix. That blending is called **interpolation**, and it's why three colored corners give a smooth gradient.

**Analogy: weather stations.** A weather map only has readings at a few stations. A town between them gets a blend, and the nearer a station is, the more it counts. The corners are the stations; every fragment is a town.

The triangle's corners are red, green, and blue. Move the dot: its `vColor` is a blend of the three corners. Then switch to `flat`, which turns the blending off: every fragment gets one corner's value, unchanged.

<div data-scene="blend"></div>

<details>
<summary>The math, if you're curious</summary>

The three weights, how much each corner counts at a spot, are that spot's **barycentric coordinates**; they always add up to 1, and with these corner colors, the dot's `vColor` is exactly its three weights. The GPU blends in a **perspective-correct** way, so a blend looks right on a triangle that runs away from the camera. `Triangle.getInterpolation` does the same blend in JavaScript.

</details>

## B · Working knowledge

### Declaring each kind

```js
geometry.setAttribute('aHeat', new BufferAttribute(heat, 1)); // one float per vertex
const material = new ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uTint: { value: new Color('#f97316') } },
  vertexShader, fragmentShader,
});
```

```glsl
attribute float aHeat; // vertex shader only; position, normal, and uv are already declared
uniform vec3 uTint;    // either shader
varying float vHeat;   // written in the vertex shader, read in the fragment shader
```

- Names must match exactly: the attribute's name in `setAttribute`, the uniform's key in `uniforms`, and a varying in both shaders. A uniform whose name doesn't match isn't an error; it just never gets your value.
- `position`, `normal`, and `uv` are declared for you. A `color` attribute is declared for you only with `vertexColors: true`; otherwise declare it yourself.

### Changing a uniform every frame

Set `value` on the material's own uniform. three.js uploads it before the next draw:

```js
material.uniforms.uTime.value = timer.getElapsed(); // in the frame loop
material.uniforms.uTint.value.set('#22c55e');         // a Color or Vector3: change it in place
```

The classic bug is building the uniform from a variable and then changing the variable. `{ value: time }` copied the number when the material was made, so the shader never sees the new one. Objects like a `Color` are different: the uniform holds the object itself, so changing it in place works. Try both buttons.

<div data-scene="clock"></div>

A uniform change is cheap: a few numbers uploaded before the draw call. Changing an attribute means uploading its whole buffer again (the updating buffers page).

### Blended values need a second look

- A normal blended between corners is shorter than 1, so normalize it again in the fragment shader: `normalize(vNormal)`, as the normal matrix page's shader did.
- `flat varying vec3 vNormal;` turns blending off for that varying: every fragment in a triangle gets the same corner's value, which gives a faceted look.

### A wireframe from a blended value

Give each triangle's three corners the values (1, 0, 0), (0, 1, 0), and (0, 0, 1), in an attribute on a non-indexed geometry, so no corner is shared (the indexed vs non-indexed page). After blending, the smallest of the three tells how close a fragment is to an edge:

```glsl
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z); // 0 on an edge
gl_FragColor = vec4(vec3(nearEdge < 0.03 ? 0.0 : 1.0), 1.0); // black lines on white
```

The lines are thinner on small triangles, since 0.03 of a small triangle is less; the derivatives page makes them an even width.

### Which space is it in?

| Value | Space |
| --- | --- |
| `position`, `normal` attributes | Measured from the object itself |
| `uv` attribute | Across the texture: 0 to 1 |
| A varying | The same space as whatever the vertex shader wrote into it |
| `uTime`, `uTint` | No space: seconds and a color |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
