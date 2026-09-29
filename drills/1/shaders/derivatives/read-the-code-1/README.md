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

> **In short:** `dFdx`, `dFdy`, and `fwidth` tell a fragment shader how much a value changes from one pixel to the next, so it can draw an edge exactly one pixel wide or work out which way the surface faces.
>
> **Used for:** Crisp grid lines on a floor at any distance; wireframe and outline overlays with no extra geometry; a faceted, low-poly look on a smooth model; and fading out patterns too fine for the screen to show.

## A · The basics

### How much does it change per pixel?

The fragment shader runs for neighboring pixels together, in small blocks, so each run can ask how different a value is in the pixel next to it. The answers are called **derivatives**, or screen-space derivatives in docs and forums:

- `dFdx(v)`: how much `v` changes from this pixel to the one on its right.
- `dFdy(v)`: how much `v` changes from this pixel to the one above it.
- `fwidth(v)`: the two added up, without their signs: roughly how much `v` changes across one pixel.

They only exist in the fragment shader, because only fragments have neighboring pixels.

**Analogy: railway sleepers.** Standing on a track, the sleepers near you are far apart in your view, and the distant ones crowd together. `fwidth(worldPos)` measures, at each spot on the screen, how much ground one pixel covers: a little up close, a lot near the horizon.

### Lines one pixel wide, with no extra geometry

A grid drawn with `step` has lines of a fixed width in world units, like painted stripes: fat up close, and thinner than a pixel far away, where they break up and shimmer. Divide the distance to a line by `fwidth`, and it's measured in pixels instead, so every line is drawn the same number of pixels wide, near or far, with a soft edge. Look across the floor with both versions, and change the width.

<div data-scene="grid"></div>

## B · Working knowledge

### An anti-aliased grid

```glsl
vec2 toLine = abs(fract(vWorldPos.xz - 0.5) - 0.5); // distance to the nearest line, in world units
vec2 inPixels = toLine / fwidth(vWorldPos.xz);       // the same distance, in pixels
float line = 1.0 - min(min(inPixels.x, inPixels.y), 1.0); // 1 on a line, fading out over one pixel
```

Where the lines get closer than a pixel apart, near the horizon, they blend into an even tint instead of flickering. The same trick fixes the hard `step` edges from the built-in functions page.

### A wireframe with even lines

The attributes, uniforms, varyings page drew triangle edges from a blended corner value, and the lines got thinner on small triangles. `fwidth` makes them even:

```glsl
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z);
float edge = 1.0 - smoothstep(0.0, fwidth(nearEdge) * 1.5, nearEdge); // about 1.5 pixels wide
```

### Flat normals without splitting vertices

```glsl
vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos))); // vViewPos: position measured from the camera
```

The two derivatives are two small steps along the surface, one across the screen and one up; their cross product points straight out of it, as on the cross product page. Every pixel of a triangle gets the same answer, so the model looks faceted even though its vertices are shared. It's how three.js's own `flatShading: true` works.

- Derivatives only compile in the fragment shader.
- Inside an `if` that goes different ways for neighboring pixels, the GLSL spec leaves them undefined, so work them out before the `if`.
- They're per screen pixel: the same surface gives different values with distance, zoom, and pixel ratio. That's the point for line widths, and something to remember anywhere else.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
