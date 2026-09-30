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

> **In short:** You can write a whole shader yourself, or keep a built-in material's lighting and patch in a few lines of your own.
>
> **Used for:** A glow on a selected part, dissolve effects, grass that sways and still casts shadows, and holograms.

## A · The basics

### Two ways in

A `ShaderMaterial` gives you only what you write: no lighting, shadows, or reflections unless you write them too. That suits a look with nothing to do with lighting, like a hologram or a debug view. To keep a part looking like steel or plastic and add something to it, patch a built-in material with `onBeforeCompile` instead.

three.js builds its materials' shaders from named pieces called **chunks**: lines like `#include <begin_vertex>` that pull in a block of code. `onBeforeCompile` hands you the source just before it's compiled, and you swap a chunk line for that line plus your own.

**Analogy: adding a skylight.** To let light into one room, you cut one hole in the roof. You don't knock the house down and rebuild it with a skylight.

Pick a version and move the glow. The patched material is still lit and reflective; the `ShaderMaterial` comes out flat.

<div data-scene="patch"></div>

## B · Working knowledge

### Patching a built-in material

```js
material.onBeforeCompile = (shader) => {
  shader.uniforms.uGlow = glow; // glow = { value: 0 }, kept so you can change it later
  shader.fragmentShader = addGlow(shader.fragmentShader);
};
```

```js
const addGlow = (source) => source
  .replace('#include <common>', '#include <common>\nuniform float uGlow;')
  .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.0, 0.45, 0.1) * uGlow;');
```

`onBeforeCompile` runs once, when the program is built, so change the effect through the uniform. `.replace` quietly does nothing when a chunk isn't there, so check the patch still lands after an upgrade. Materials whose patch functions have the same text share one program; give each variant its own `customProgramCacheKey`.

### The shadow that doesn't follow

A vertex patch goes after `#include <begin_vertex>`, where `transformed` holds the position, measured from the object itself. The shadow pass draws the mesh again with a built-in depth material, so give that the same patch:

```js
mesh.material.onBeforeCompile = push; // push: adds 'transformed += normal * 0.05;' after begin_vertex
mesh.customDepthMaterial = new MeshDepthMaterial(); // customDistanceMaterial for a point light
mesh.customDepthMaterial.onBeforeCompile = push;    // the same patch as the material's
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
