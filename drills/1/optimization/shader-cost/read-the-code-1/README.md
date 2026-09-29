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

> **In short:** Every material runs a shader for each pixel it covers, and that work grows with the material type, each extra feature switched on, the number of lights, and shadows, so the cheapest material that still looks right is the one to pick.
>
> **Used for:** A lighter look for phones and low-end laptops; a showroom or a street at night lit by many lights; deciding which parts cast shadows; and choosing between Standard and Physical for car paint, fabric, or glass.

## A · The basics

### The cost is paid at every pixel

The materials tour gave each material's cost, and the pipeline stages page showed where it's paid: the fragment shader runs for every pixel a mesh covers. Four things set how much work each of those pixels takes:

- **The type.** Basic does almost nothing; Lambert and Phong a little for each light; Standard and Physical the most, since they work out light the way real surfaces reflect it.
- **Features switched on.** Each map and each extra adds work. three.js builds every shader with only the features its material uses.
- **Lights.** A lit material works out every light at every pixel, so each light adds lighting work everywhere it's drawn.
- **Shadows.** Each light that casts shadows draws the casting meshes again every frame, into its shadow map (the draw call anatomy page).

### Physical costs what you switch on

`MeshPhysicalMaterial` is Standard plus extras: clearcoat, sheen, transmission, and more. Each extra starts at 0 and is left out of the shader while it's 0, so a Physical material with none switched on costs close to a Standard one. Each extra you switch on adds shader work. Transmission, for glass, adds far more: every frame, three.js draws all the solid objects a second time into a picture for the glass to show through.

**Analogy: options on a car.** The top model with every option left unticked costs close to the base one. Each option you tick adds to the bill, and one of them, like a sunroof, means cutting a hole in the roof.

Try each material on the sphere. The readout shows the line that made it, the features its compiled shader was built with, and the draw calls.

<div data-scene="materials"></div>

## B · Working knowledge

### A cheaper look where it's needed

```js
part.material = quality === 'low'
  ? new MeshLambertMaterial({ color, map })             // matte, a little work per light
  : new MeshStandardMaterial({ color, map, roughness: 0.5 });
```

- Basic or Matcap for things that don't need lighting, Lambert for matte parts, Phong for a shine. The cheaper ones look different, so check them side by side.
- Choosing `quality` is the adaptive quality page's job, later in this domain.

### Lights

- **Keep lights few.** Light that never changes can be baked into textures instead (the baked lighting page, in the materials domain).
- **`intensity = 0` doesn't remove a light.** It still sits in every lit material's shader, costing work at every pixel. `light.visible = false` takes it out, and like adding or removing a light, it makes three.js build new shaders for every lit material (the decode, upload, compile page).

### Shadows

```js
sun.shadow.mapSize.set(1024, 1024); // 512 by default; bigger costs memory and pixel work
crate.castShadow = true;            // only on the meshes whose shadows show
renderer.shadowMap.autoUpdate = false; // for a still scene: draw shadows once,
renderer.shadowMap.needsUpdate = true; // and again only after something moves
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
