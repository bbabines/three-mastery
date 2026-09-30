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

> **In short:** Writing letters after a GLSL vector, like `p.xz`, builds a new vector from just those parts, in whatever order you list them.
>
> **Used for:** Distance along the floor, reading one channel of a packed texture, converting Z-up data, and building a `vec4` from a `vec3`.

## A · The basics

### Letters pick parts

A GLSL vector's parts have letter names, and you can pick several at once. That's called **swizzling**:

```glsl
vec3 p = vec3(1.0, 2.0, 3.0);
p.xz;  // vec2(1.0, 3.0): x and z, leaving out y
p.zyx; // vec3(3.0, 2.0, 1.0): reversed
p.xxx; // vec3(1.0, 1.0, 1.0): repeated
```

There are three sets of letters for the same four slots: `xyzw` for positions and directions, `rgba` for colors, and `stpq` for texture coordinates. `color.r` and `color.x` are the same number. Use one set at a time: `p.xg` doesn't compile.

**Analogy: picking tracks for a playlist.** Take tracks 1 and 3 from an album, in any order, even one twice. The album doesn't change; you've made a new list from it.

Switch between the three distances. With `.xz`, each pillar keeps one color from bottom to top; with the whole position, the rings curve up over them.

<div data-scene="floor"></div>

## B · Working knowledge

### Everyday swizzles

```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // a vec3 and one number make a vec4
gl_FragColor = vec4(texColor.rgb * 0.5, texColor.a);                    // work on the color, keep alpha
p.xz *= 2.0;                                                            // change two parts at once
float roughness = texture2D(ormMap, vUv).g;                             // one channel of a packed texture
```

glTF packs occlusion, roughness, and metalness into one texture's red, green, and blue, so `.g` reads the roughness. On the left of `=`, a swizzle can't repeat a letter: `p.xx = vec2(1.0);` doesn't compile.

### Z-up is not just a swizzle

Blender and most CAD tools use Z for up; three.js uses Y. Swapping the two with `p.xzy` looks like the fix, but swapping two axes mirrors the model, so front and back trade places. The conversion is a turn, which also flips one sign:

```glsl
vec3 yUp = vec3(p.x, p.z, -p.y); // from Z-up to Y-up: a -90° turn around X
```

glTF files are always Y-up, so this comes up with raw data: point clouds, CAD exports, and positions from a server.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
