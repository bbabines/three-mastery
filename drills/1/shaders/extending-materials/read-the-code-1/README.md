---
id: 1.shaders.extending-materials.read-the-code.1
loop: 1
tier: light
concepts: [shaders.extending-materials]
mode: read-the-code
context: shaders.extending-materials/highlight
lenses: []
misconceptions:
  - shaders.extending-materials/rebuild-lighting
---

# Extending materials

> **In short:** To change how something is drawn, you either write the whole shader yourself with a `ShaderMaterial`, or keep one of three.js's materials, lighting and all, and patch a few of its lines with `onBeforeCompile`.
>
> **Used for:** A glow on a selected product part that keeps its real finish; a part that dissolves away or builds itself in; grass and flags that sway in the wind and still take shadows; and holograms, scan lines, and debug views that don't need lighting at all.

## A · The basics

### Two ways in

| Way | What you get | When to pick it |
| --- | --- | --- |
| `ShaderMaterial` | Only what you write: no lighting, shadows, or reflections unless you write them too | The look has nothing to do with lighting: a hologram, a scan line, a debug view |
| `onBeforeCompile` on a built-in material | Everything the material already does, plus your lines | The part should still look like steel or plastic, with something added |
| `RawShaderMaterial` | Nothing added: you declare even `position` and the matrices, and three.js fills them in | Rarely: full control over every line |

three.js builds its materials' shaders from named pieces called **chunks**: lines like `#include <begin_vertex>` that pull in a block of code. `onBeforeCompile` hands you the shader's source just before three.js compiles it, and you swap a chunk line for that line plus your own.

**Analogy: adding a skylight.** To let light into one room, you cut one hole in the roof. You don't knock the house down and rebuild it with a skylight.

Pick a version and move the glow. The patched material is still lit by the sun and still reflects the room. The `ShaderMaterial` has only what its few lines say, so it comes out flat.

<div data-scene="patch"></div>

## B · Working knowledge

### Patching a built-in material

```js
const glow = { value: 0 }; // keep the uniform: the shader object is only handed to you once
material.onBeforeCompile = (shader) => {
  shader.uniforms.uGlow = glow;
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform float uGlow;')
    .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.0, 0.45, 0.1) * uGlow;');
};
glow.value = 0.6; // later: from a slider or the frame loop
```

- `onBeforeCompile` runs once, when three.js builds the program, not every frame. Change the effect through uniforms.
- `.replace` quietly does nothing when the text isn't there, and chunk names can change between three.js versions. This repo pins r186; check the chunk still exists after an upgrade.
- three.js reuses a compiled program for materials with the same settings, and by default it tells patches apart by the text of the `onBeforeCompile` function. If one function patches in different code for different materials, say from a variable, give each its own key: `material.customProgramCacheKey = () => variant;`.

### Moving vertices, and the shadow that doesn't follow

A vertex patch goes after `#include <begin_vertex>`, where `transformed` holds the vertex's position, measured from the object itself:

```js
const push = { value: 0.05 };
const patchVertices = (shader) => {
  shader.uniforms.uPush = push;
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nuniform float uPush;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normal * uPush;');
};
mesh.material.onBeforeCompile = patchVertices;
```

The shadow pass doesn't draw your material. It draws the mesh again with a built-in depth material, so the shadow keeps the unmoved shape. Give the mesh a depth material with the same patch; the shadows page in the materials domain covers the rest of shadows:

```js
mesh.customDepthMaterial = new MeshDepthMaterial();       // customDistanceMaterial for a point light
mesh.customDepthMaterial.onBeforeCompile = patchVertices; // the same patch as the material's
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
