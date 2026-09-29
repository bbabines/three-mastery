---
id: 1.shaders.swizzling.read-the-code.1
loop: 1
tier: light
concepts: [shaders.swizzling]
mode: read-the-code
context: shaders.swizzling/ground-distance
lenses: []
misconceptions:
  - shaders.swizzling/converts-axes
---

# Swizzling

> **In short:** In GLSL you pick a vector's parts by letter, in any order and even repeated, like `p.xz` or `color.bgr`, and get a new, shorter or reordered vector in one step.
>
> **Used for:** Distance along the floor that ignores height; reading one channel of a texture that packs several values; converting points from a tool that uses Z for up; and building a `vec4` from a `vec3` and one more number.

## A · The basics

### Letters pick parts

A GLSL vector's parts have letter names, and you can pick several at once. That's called **swizzling**:

```glsl
vec3 p = vec3(1.0, 2.0, 3.0);
p.x;    // 1.0, a float
p.xz;   // vec2(1.0, 3.0): x and z, leaving out y
p.zyx;  // vec3(3.0, 2.0, 1.0): reversed
p.xxx;  // vec3(1.0, 1.0, 1.0): repeated
```

There are three sets of letters for the same four slots: `xyzw` for positions and directions, `rgba` for colors, and `stpq` for texture coordinates. `color.r` and `color.x` are the same number. Use one set at a time: `p.xg` doesn't compile.

**Analogy: picking tracks for a playlist.** Take tracks 1 and 3 from an album, in any order, even one twice. The album itself doesn't change; you've just made a new list from it.

Distance along the floor is the most common swizzle. The pillars are colored in rings by distance from the center. With `.xz`, height is left out, so each pillar is one color from bottom to top. With the whole position, height counts too, and the rings curve over the pillars. `.xy` measures across a wall instead of the floor.

<div data-scene="floor"></div>

## B · Working knowledge

### Everyday swizzles

```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // a vec3 and one number make a vec4
gl_FragColor = vec4(texColor.rgb * 0.5, texColor.a);                    // work on the color, keep alpha
p.xz *= 2.0;                                                            // change two parts at once
float roughness = texture2D(ormMap, vUv).g;                             // one channel of a packed texture
```

- On the left of `=`, a swizzle can't repeat a letter: `p.xx = vec2(1.0);` doesn't compile.
- glTF packs three values into one texture: occlusion in red, roughness in green, metalness in blue. `.g` reads the roughness. The channel packing page covers packed maps.

### Z-up is not just a swizzle

Blender and most CAD tools use Z for up; three.js uses Y. Swapping the two with `p.xzy` looks like the fix, but swapping two axes mirrors the model, like the negative scale page's flip: what should be in front ends up behind, and the model is inside out. The conversion is a turn, which also flips one sign:

```glsl
vec3 yUp = vec3(p.x, p.z, -p.y); // from Z-up to Y-up: the same as rotating -90° around X
```

glTF files are always Y-up, so a model exported from Blender as glTF arrives already converted. The flip comes up with raw data: point clouds, CAD exports, positions from a server.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
