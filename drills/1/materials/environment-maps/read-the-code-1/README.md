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

> **In short:** An environment map is a picture of the surroundings that lights a scene and fills its reflections, whether or not it's shown behind.
>
> **Used for:** Chrome reflections, soft studio lighting with no lights to place, a consistent look across products, and blending into photos.

## A · The basics

### A picture of the surroundings

A metal is nothing but reflection, so it needs something to reflect, and ordinary lights only give it a few bright dots. An **environment map** is a picture of everything around the scene, in every direction, like the inside of a globe: sky, walls, windows, softboxes.

Set as `scene.environment`, it does two jobs for every physically based material. Each point reflects the part of the picture it would mirror, sharp on smooth surfaces and blurred on rough ones, and each point is lit by the whole picture around it, the way a room lights anything in it. Lighting from a picture is called **image-based lighting**, or **IBL**. Showing the picture behind everything is a separate setting, `scene.background`.

**Analogy: a photo studio.** The white walls and softboxes light a product, and you see them reflected in its chrome. Whether the camera shows the walls is a separate choice: crop them out and they still light it.

Try each combination. Neither ball has a light; only the environment lights them.

<div data-scene="envOrBackground"></div>

### Blurred to match roughness

Blurring a reflection pixel by pixel would be slow, so three.js blurs the picture ahead of time, once for each roughness level, with a tool called **PMREM**. A surface then reads the copy blurred to its own roughness. It happens once, the first time the environment is used, and you never touch the blurred copies.

## B · Working knowledge

### Loading an HDR environment

```js
const env = await new HDRLoader().loadAsync('/env/studio.hdr');
env.mapping = EquirectangularReflectionMapping; // a panorama wrapped all the way around
scene.environment = env; // lights and reflections
scene.background = env;  // optional: show it behind the scene
```

`HDRLoader` comes from `three/addons/loaders/HDRLoader.js`. An HDR file stores light brighter than white, which makes reflected lamps look bright, so use tone mapping with it. `RGBELoader` is its old name: it still loads, but logs a warning to switch.

### A studio with no file

```js
const pmrem = new PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
```

`RoomEnvironment`, from `three/addons/environments/RoomEnvironment.js`, is a small room with bright panels, built in code. It's a scene, not a picture, so `PMREMGenerator` photographs and blurs it into an environment.

### Tuning it

```js
scene.environmentIntensity = 0.8;          // brightness of its light and reflections
scene.environmentRotation.y = Math.PI / 4; // turns the environment, not the background
```

`scene.environment` reaches Standard, Physical, Lambert, and Phong materials, and a material's own `envMap` wins over it. With `scene.environment`, each material's `envMapIntensity` is ignored; it counts only with the material's own `envMap`. Turn and dim the environment.

<div data-scene="turnEnvironment"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
