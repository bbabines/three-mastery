---
id: 1.materials.environment-maps.read-the-code.1
loop: 1
tier: core
concepts: [materials.environment-maps]
mode: read-the-code
context: materials.environment-maps/env-vs-background
lenses: []
misconceptions:
  - materials.environment-maps/just-background
---

# Environment maps and IBL

> **In short:** An environment map is a picture of everything around the scene, in every direction; set as `scene.environment`, it lights physically based materials and gives them something to reflect, blurred to match each surface's roughness, which is called image-based lighting (IBL), while showing it behind the scene is a separate setting, `scene.background`.
>
> **Used for:** Chrome and polished metal that reflect a believable room; the soft, even studio look of product viewers, with no lights to place; making a model look the same on every page of a site by sharing one environment; and blending a product into a photo of a real place.

## A · The basics

### A picture of the surroundings

The PBR page showed that a metal is nothing but reflection, so it needs something to reflect. Ordinary lights only give it a few bright dots. An **environment map** is a picture of everything around the scene, in every direction, like the inside of a globe: sky, walls, windows, softboxes.

Set as `scene.environment`, it does two jobs for every physically based material in the scene:

- **Reflection:** each point shows the part of the picture it would mirror, sharp on smooth surfaces and blurred on rough ones.
- **Lighting:** each point is also lit by the whole picture around it, brightest from the bright parts, the way a room lights anything in it. This is called **image-based lighting**, or **IBL**.

Showing the picture behind everything is a different setting, `scene.background`. One doesn't imply the other.

**Analogy: a photo studio.** The white walls and softboxes around a product light it, and you see them reflected in its chrome. Whether the camera shows the walls behind the product is a separate choice: you can crop them out, and they still light it.

Try each combination. The chrome ball and the blue painted ball have no lights at all, only the environment.

<div data-scene="envOrBackground"></div>

### Blurred to match roughness

Reading a blurred reflection pixel by pixel would be slow, so three.js blurs the picture ahead of time, once for each roughness level, with a tool called **PMREM** (a prefiltered, mipmapped radiance environment map). A surface then reads the copy blurred to its own roughness. It happens once, the first time the environment is used, and you never touch the blurred copies.

## B · Working knowledge

### Loading an HDR environment

```js
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const env = await new HDRLoader().loadAsync('/env/studio.hdr');
env.mapping = EquirectangularReflectionMapping; // a panorama wrapped all the way around
scene.environment = env; // lights and reflections
scene.background = env;  // optional: show it behind the scene
```

- **HDR** files store light brighter than white, which is what makes reflections of lamps and windows look bright. Use tone mapping with them (the tone mapping page).
- three.js runs the PMREM blurring for you when `mapping` is set. `RGBELoader` is the old name for `HDRLoader`: r186 still has it, but it logs a warning to switch.
- An HDR image costs twice the GPU memory of an ordinary one the same size; the runtime memory math page puts numbers on it.

### A studio with no file

```js
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const pmrem = new PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
```

`RoomEnvironment` is a small room with bright panels, built in code. It's a scene, not a picture, so `PMREMGenerator` photographs and blurs it into an environment. The scenes on this page use it.

### Tuning it

```js
scene.environmentIntensity = 0.8;          // brightness of its light and reflections
scene.environmentRotation.y = Math.PI / 4; // turns the environment, not the background

scene.background = new Color('#f4f4f5');   // a plain background; the environment still lights
// or: scene.background = env; scene.backgroundBlurriness = 0.3; // shown, softly out of focus
```

- `scene.environment` reaches `MeshStandardMaterial`, `MeshPhysicalMaterial`, `MeshLambertMaterial`, and `MeshPhongMaterial`. `MeshBasicMaterial` ignores it and uses only its own `material.envMap`, and a material's own `envMap` always wins over the scene's.
- With `scene.environment`, `scene.environmentIntensity` sets the strength, and each material's own `envMapIntensity` is ignored. `envMapIntensity` only counts for a material's own `envMap`.
- Share one environment across every product view for a consistent look, rather than a different light rig per page.

Turn and dim the environment. Both balls change together, because the one environment lights and reflects for every material in the scene.

<div data-scene="turnEnvironment"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
