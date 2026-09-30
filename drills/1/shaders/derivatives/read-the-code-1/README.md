---
id: 1.shaders.derivatives.read-the-code.1
loop: 1
tier: light
concepts: [shaders.derivatives]
mode: read-the-code
context: shaders.derivatives/aa-grid
lenses: []
misconceptions:
  - shaders.derivatives/extra-geometry
---

# Derivatives

> **In short:** A fragment shader can ask how much a value differs in the next pixel over, and use that to draw crisp one-pixel edges.
>
> **Used for:** Crisp grid lines at any distance, even wireframe lines, a faceted low-poly look, and fading out too-fine patterns.

## A · The basics

### How much does it change per pixel?

The fragment shader runs for neighboring pixels together, in small blocks, so each run can ask how different a value is next door. The answers are called **derivatives**:

- `dFdx(v)`: how much `v` changes from this pixel to the one on its right.
- `dFdy(v)`: how much it changes to the pixel above.
- `fwidth(v)`: the two added up, without their signs: roughly how much `v` changes across one pixel.

They only exist in the fragment shader, because only fragments have neighboring pixels.

**Analogy: railway sleepers.** Standing on a track, the near sleepers look far apart and the distant ones crowd together. `fwidth` measures that crowding: how much ground one pixel covers at each spot.

### Lines one pixel wide

A grid drawn with `step` has lines of a fixed width in world units: fat up close, and thinner than a pixel far away, where they shimmer. Divide the distance to a line by `fwidth`, and it's measured in pixels instead, so every line is the same number of pixels wide.

Look across the floor with both versions, and change the width.

<div data-scene="grid"></div>

## B · Working knowledge

### An anti-aliased grid

```glsl
vec2 toLine = abs(fract(vWorldPos.xz - 0.5) - 0.5);       // distance to the nearest line, in world units
vec2 inPixels = toLine / fwidth(vWorldPos.xz);            // the same distance, in pixels
float line = 1.0 - min(min(inPixels.x, inPixels.y), 1.0); // 1 on a line, fading out over one pixel
```

Where the lines get closer than a pixel apart, near the horizon, they blend into an even tint instead of flickering.

### A wireframe with even lines

Blended corner values can draw a model's triangle edges, but the lines get thinner on small triangles. `fwidth` makes them even:

```glsl
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z);
float edge = 1.0 - smoothstep(0.0, fwidth(nearEdge) * 1.5, nearEdge); // about 1.5 pixels wide
```

### Flat normals without splitting vertices

```glsl
vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos))); // vViewPos: position measured from the camera
```

The two derivatives are two small steps along the surface, and their cross product points straight out of it. Every pixel of a triangle gets the same answer, so the model looks faceted even though its vertices are shared. It's how `flatShading: true` works.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
