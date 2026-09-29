---
id: 1.materials.light-types.read-the-code.1
loop: 1
tier: light
concepts: [materials.light-types]
mode: read-the-code
context: materials.light-types/mm-vs-m
lenses: []
misconceptions:
  - materials.light-types/units-dont-matter
---

# Light types and falloff

> **In short:** Lights differ in where their light comes from and how it fades: directional, hemisphere, and ambient light reach everything equally at any distance, while point and spot light fade with the square of the distance, so how far away a light is, in the scene's own units, sets how bright it looks.
>
> **Used for:** Placing studio lights around a product so it's evenly lit; fixing a CAD model exported in millimeters that comes out pitch dark; lamps and glowing parts that light only what's near them; and keeping fill light from flattening a scene.

## A · The basics

### From far away, or from a spot

The lights tour listed the six lights. They split into two groups by how their light fades:

- **No fading:** `DirectionalLight`, `HemisphereLight`, and `AmbientLight` light a surface just as brightly at any distance. A directional light is treated as infinitely far away, like the sun.
- **Fading with distance:** `PointLight` and `SpotLight` shine from a spot, and their light spreads over a bigger and bigger sphere as it travels. Twice as far away, a surface gets a quarter of the light; three times as far, a ninth. That's called **falloff** with the square of the distance, or the **inverse-square law**.

**Analogy: a campfire and the sun.** Step back from a campfire and you feel much less heat with every step. Step back from a sunny window and nothing changes: the sun is so far away that your steps don't count.

Raise the light above the block and switch its type. The readout reads the block's top face color off the screen.

<div data-scene="falloff"></div>

### Why scene units matter

three.js has no idea what one unit means. Its physically based light intensities, like a point light's candela, assume distances in meters, and glTF files are in meters too (the glTF spec says so). A CAD model exported in millimeters is a thousand times bigger in numbers: a lamp "2 meters" above it sits 2000 units away, and inverse-square falloff makes it a million times dimmer than in a meters scene. Directional light doesn't care, which is why such a scene can look fine in daylight and pitch dark under its lamps.

## B · Working knowledge

### Point and spot light settings

```js
const lamp = new PointLight(0xffe0b0, 30, 0, 2); // color, intensity, distance, decay
```

- **`distance`** (default 0) is where the light is cut off. 0 means never; a positive value fades it smoothly to nothing at that distance, which keeps a small lamp from lighting faraway things, but isn't physical.
- **`decay`** (default 2) is the falloff's power: 2 is the real, inverse-square falloff. three.js's docs say to leave it at 2 for physically based rendering.

### A model in the wrong units

Fix the model, not the lights: scale it to meters when it loads.

```js
const gltf = await loader.loadAsync('/models/cabinet-mm.glb');
gltf.scene.scale.setScalar(0.001); // millimeters to meters
```

Turning every intensity up a millionfold works for the lights, but leaves shadow cameras, the camera's near and far planes, and anything else tuned in meters wrong.

### Ambient flattening

`AmbientLight` adds the same light to every surface, whichever way it faces, so it lightens the shadowed side as much as the lit side and the shape flattens out. A little lifts pure-black shadows; a lot makes a product look like flat cardboard. Prefer a `HemisphereLight`, whose sky and ground colors vary with the direction a surface faces, or an environment (the environment maps page).

### RectAreaLight

A softbox or window: `RectAreaLightUniformsLib.init()` first, and it lights only Standard and Physical materials, as the lights tour covers. It fades with distance too, and its size changes how soft its reflections look.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
