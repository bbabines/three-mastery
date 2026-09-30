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

> **In short:** Some lights reach everything equally, while point and spot lights fade with distance, so a scene's units change how bright they look.
>
> **Used for:** Placing studio lights, fixing CAD models in millimeters, lamps that light only what's near, and subtle fill light.

## A · The basics

### From far away, or from a spot

Lights split into two groups by how their light fades. `DirectionalLight`, `HemisphereLight`, and `AmbientLight` light a surface just as brightly at any distance; a directional light is treated as infinitely far away, like the sun. `PointLight` and `SpotLight` shine from a spot, and their light spreads out as it travels: twice as far away, a surface gets a quarter of the light, and three times as far, a ninth. That **falloff** with the square of the distance is called the inverse-square law.

**Analogy: a campfire and the sun.** Step back from a campfire and you feel much less heat with every step. Step back from a sunny window and nothing changes, because the sun is so far away that your steps don't count.

Raise the light above the block and switch its type, then add some ambient light. Watch the block's top.

<div data-scene="falloff"></div>

### Why scene units matter

three.js has no idea what one unit means, but its light intensities assume meters, and glTF files use meters too. A CAD model exported in millimeters is a thousand times bigger in numbers: a lamp "2 meters" above it sits 2000 units away, and falloff makes it a million times dimmer. Directional light doesn't care, which is why such a scene can look fine in daylight and pitch dark under its lamps.

## B · Working knowledge

### Point and spot light settings

```js
const lamp = new PointLight(0xffe0b0, 30, 0, 2); // color, intensity, distance, decay
```

`distance`, 0 by default, is where the light is cut off: 0 means never, and a positive value fades it smoothly to nothing at that distance, which isn't physical. `decay`, 2 by default, is the real inverse-square falloff; leave it at 2.

### A model in the wrong units

```js
const gltf = await loader.loadAsync('/models/cabinet-mm.glb');
gltf.scene.scale.setScalar(0.001); // millimeters to meters
```

Fix the model, not the lights. Turning every intensity up a millionfold leaves shadow cameras, the camera's near and far planes, and anything else tuned in meters wrong.

### Ambient flattening

`AmbientLight` adds the same light to every surface, whichever way it faces, so the shadowed side brightens as much as the lit side and the shape flattens out. A little lifts pure-black shadows; for more, prefer a `HemisphereLight` or an environment, which vary with the way a surface faces.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
