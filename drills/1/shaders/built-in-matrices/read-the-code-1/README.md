---
id: 1.shaders.built-in-matrices.read-the-code.1
loop: 1
tier: core
concepts: [shaders.built-in-matrices]
mode: read-the-code
context: shaders.built-in-matrices/world-height
lenses: []
misconceptions:
  - shaders.built-in-matrices/world-normals
---

# Built-in matrices and spaces

> **In short:** three.js gives your shaders the matrices that carry a vertex from the object to the world, the camera, and the screen.
>
> **Used for:** Coloring by height in the world, rim glows, fog that thickens with distance, and scan lines across the screen.

## A · The basics

### Same spot, different numbers

The attributes `position` and `normal` are measured from the object itself, and nothing converts them until you multiply by a matrix. three.js hands the vertex shader one matrix for each step: `modelMatrix` is the mesh's `matrixWorld`, `viewMatrix` is the camera's `matrixWorldInverse`, and `projectionMatrix` is its lens.

```glsl
vec4 worldPos = modelMatrix * vec4(position, 1.0); // the world
vec4 viewPos = viewMatrix * worldPos;             // measured from the camera
gl_Position = projectionMatrix * viewPos;         // clip space
```

That's the usual `projectionMatrix * modelViewMatrix * vec4(position, 1.0)`, split open so you can keep the stops you need.

**Analogy: directions to a stadium seat.** "Third from the aisle", "Section 12", and "two rows in front of me" can all name one seat. Mix them up and someone ends up in the wrong place.

The lines are every quarter unit of height, in the space you pick. Tilt, lift, and orbit to see which lines move.

<div data-scene="heights"></div>

<details>
<summary>The math, if you're curious</summary>

clip position = projection × view × model × position. The three together are called the **MVP** matrix, and the one on the right acts first.

</details>

## B · Working knowledge

### normalMatrix is measured from the camera

`normalMatrix` turns normals into the camera's space, not the world's, so compare its normals only with directions measured from the camera. A rim glow works there, because you always look along −Z:

```glsl
vec3 n = normalize(normalMatrix * normal); // measured from the camera
float rim = 1.0 - abs(n.z);                // 0 facing you, 1 side-on
```

For a world normal, use `mat3(modelMatrix) * normal`, as long as the object isn't stretched unevenly, and compare it with world directions. Try the three versions, and orbit.

<div data-scene="rim"></div>

### Only the vertex shader gets them all

The fragment shader gets only `viewMatrix`, `cameraPosition`, and `isOrthographic`. Work anything else out in the vertex shader and hand it over:

```glsl
varying vec3 vWorldPos;                               // in both shaders
vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz; // vertex shader
float away = distance(vWorldPos, cameraPosition);    // fragment shader: for fog or a fade
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `position`, `normal` | Measured from the object itself |
| `modelMatrix * vec4(position, 1.0)`, `cameraPosition` | The world |
| `modelViewMatrix * vec4(position, 1.0)`, `normalMatrix * normal` | Measured from the camera |
| `gl_Position` | Clip space |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
