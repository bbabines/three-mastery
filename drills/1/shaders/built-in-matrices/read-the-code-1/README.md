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

> **In short:** three.js hands every ShaderMaterial the matrices that carry a vertex from the object's own measurements to the world, to the camera, and onto the screen, and every value in a shader is in exactly one of those spaces.
>
> **Used for:** Coloring a model by its height in the world, like a flood line or a heat map; rim glows that hug a part's outline as the camera moves; fog and fades by distance from the camera; and effects laid out on the screen, like a scan line.

## A · The basics

### Same spot, different numbers

The Domain 2 pages measured one spot several ways: from the object itself, from its parent, from the world. The view matrix page added one more, measured from the camera. A vertex shader works with the same spaces, and three.js hands it the matrices that convert between them:

| In the shader | Converts | Same as, in JavaScript |
| --- | --- | --- |
| `modelMatrix` | Measured from the object itself → the world | `mesh.matrixWorld` |
| `viewMatrix` | The world → measured from the camera | `camera.matrixWorldInverse`, the view matrix |
| `modelViewMatrix` | Both at once: the object itself → measured from the camera | `mesh.modelViewMatrix` |
| `projectionMatrix` | Measured from the camera → clip space | `camera.projectionMatrix` |
| `normalMatrix` | Normals: the object itself → measured from the camera | `mesh.normalMatrix` |
| `cameraPosition` | Not a matrix: where the camera is, in the world | `camera.getWorldPosition(v)` |

The attributes `position` and `normal` are measured from the object itself, and nothing converts them until you multiply.

**Analogy: three ways to say where your seat is.** "Third seat from the aisle" is measured from the row, "Section 12 of the stadium" from the stadium, and "two rows in front of me" from your friend. It's one seat, with three sets of directions, and mixing them up sends someone to the wrong place.

The cylinder is colored with lines every quarter unit of height, measured in the space you pick. Tilt it, lift it, and orbit. Lines measured from the object itself ride along with it. Lines in the world stay level, like a water line. Lines measured from the camera change as you orbit.

<div data-scene="heights"></div>

### Getting each space

```glsl
vec4 worldPos = modelMatrix * vec4(position, 1.0); // the world
vec4 viewPos = viewMatrix * worldPos;             // measured from the camera
gl_Position = projectionMatrix * viewPos;         // clip space
```

That's the same as the one-line `projectionMatrix * modelViewMatrix * vec4(position, 1.0)`, split open so you can keep the stops you need. The `1.0` marks `position` as a place, so the move part of each matrix applies, as on the points vs directions page.

<details>
<summary>The math, if you're curious</summary>

Docs and forums call the three together the **MVP** matrix, for model, view, projection: clip position = projection × view × model × position. Matrices apply right to left, so the model matrix acts first. three.js's `modelViewMatrix` is the view and model parts already multiplied together, on the CPU.

</details>

## B · Working knowledge

### normalMatrix is measured from the camera

`normalMatrix` is the camera-space normal matrix from the normal matrix page: it turns normals into the camera's space, not the world's. A normal from it can only be compared with directions measured from the camera. A rim glow, which lights up where a surface turns side-on to the viewer, works in that space because the viewer always looks along −Z there:

```glsl
vec3 n = normalize(normalMatrix * normal); // measured from the camera
float rim = 1.0 - abs(n.z);                // 0 facing you, 1 side-on
```

For a world normal there's no built-in. `mat3(modelMatrix) * normal` works unless the object is stretched unevenly (then pass your own matrix from `new Matrix3().getNormalMatrix(mesh.matrixWorld)`), and it has to be compared with world directions, like `cameraPosition - worldPos.xyz`. Try the three versions, and orbit.

<div data-scene="rim"></div>

### Only the vertex shader gets them all

The fragment shader gets only `viewMatrix`, `cameraPosition`, and `isOrthographic` from three.js. For anything else, work it out in the vertex shader and hand it over as a varying:

```glsl
varying vec3 vWorldPos;                               // in both shaders
vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz; // vertex shader
float away = distance(vWorldPos, cameraPosition);    // fragment shader: for fog or a fade
```

### Instanced meshes

On an `InstancedMesh`, each copy's own transform is the attribute `instanceMatrix`. three.js declares it, but your vertex shader has to apply it: `modelViewMatrix * instanceMatrix * vec4(position, 1.0)`. Without it, every copy is drawn in the same spot (the InstancedMesh page).

### Which space is it in?

This page works between **measured from the object itself**, **the world**, **measured from the camera**, and **clip space**.

| Value | Space |
| --- | --- |
| `position`, `normal` | Measured from the object itself |
| `modelMatrix * vec4(position, 1.0)`, `cameraPosition` | The world |
| `mat3(modelMatrix) * normal` | The world, as long as the object isn't stretched unevenly |
| `viewMatrix * worldPos`, `modelViewMatrix * vec4(position, 1.0)` | Measured from the camera (view space): x right, y up, −z in front |
| `normalMatrix * normal` | Measured from the camera |
| `gl_Position` | Clip space |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
