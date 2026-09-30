---
id: 1.optimization.shader-cost.read-the-code.1
loop: 1
tier: light
concepts: [optimization.shader-cost]
mode: read-the-code
context: optimization.shader-cost/mobile-fallback
lenses: []
misconceptions:
  - optimization.shader-cost/physical-always-costly
---

# Shader and material cost

> **In short:** Each material type, feature, light, and shadow adds work at every pixel, so pick the cheapest material that still looks right.
>
> **Used for:** Lighter looks for phones, showrooms lit by many lights, choosing which parts cast shadows, and car paint or glass.

## A · The basics

### The cost is paid at every pixel

The fragment shader runs for every pixel a mesh covers, and four things set how much work each of those pixels takes:

- The type: Basic does almost nothing, Lambert and Phong a little for each light, and Standard and Physical the most.
- The maps and features switched on. three.js builds each shader with only the features its material uses.
- The lights, each one worked out at every lit pixel.
- The shadows: each light that casts them draws the casting meshes again every frame.

### Physical costs what you switch on

`MeshPhysicalMaterial` is Standard plus extras like clearcoat, sheen, and transmission. Each starts at 0 and is left out of the shader while it's 0, so a Physical material with none switched on costs close to a Standard one. Each extra you switch on adds shader work, and transmission, for glass, adds far more: every frame, three.js draws all the solid objects again into a picture for the glass to show through.

**Analogy: options on a car.** The top model with every option unticked costs close to the base one. Each option you tick adds to the bill, and one of them, like a sunroof, means cutting a hole in the roof.

Try each material on the sphere, and watch which features its shader was built with and the draw calls.

<div data-scene="materials"></div>

## B · Working knowledge

### A cheaper look where it's needed

```js
part.material = quality === 'low'
  ? new MeshLambertMaterial({ color, map })             // matte, a little work per light
  : new MeshStandardMaterial({ color, map, roughness: 0.5 });
```

Use Basic for things that don't need lighting, Lambert for matte parts, and Phong for a shine. The cheaper ones look different, so check them side by side.

### Lights

```js
lamp.intensity = 0;   // still worked out at every lit pixel
lamp.visible = false; // out of the shaders, which rebuild once
```

Keep lights few, and bake light that never changes into textures. A light at `intensity = 0` stays in every lit material's shader. Hiding it takes it out, and like adding or removing a light, it makes three.js rebuild the shaders of every lit material.

### Shadows

```js
sun.shadow.mapSize.set(1024, 1024);     // 512 by default; bigger costs memory and pixel work
crate.castShadow = true;                // only on the meshes whose shadows show
renderer.shadowMap.autoUpdate = false;  // for a still scene: draw shadows once,
renderer.shadowMap.needsUpdate = true;  // and again only after something moves
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
