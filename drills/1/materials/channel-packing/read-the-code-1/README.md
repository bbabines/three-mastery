---
id: 1.materials.channel-packing.read-the-code.1
loop: 1
tier: light
concepts: [materials.channel-packing]
mode: read-the-code
context: materials.channel-packing/reading-packed
lenses: []
misconceptions:
  - materials.channel-packing/separate-textures
---

# Channel packing

> **In short:** One texture can carry three grayscale maps at once, one in each of its red, green, and blue channels.
>
> **Used for:** Reading glTF's odd-colored textures, exporting from Blender or Substance, fixing wrong-looking roughness, and saving memory.

## A · The basics

### Three grayscale maps in one texture

Roughness, metalness, and ambient occlusion each hold one number per pixel, so each is a grayscale image. A texture has room for four numbers per pixel: red, green, blue, and alpha. Storing each grayscale map in its own channel packs three maps into one texture, and glTF and three.js agree on the order:

| Channel | Holds |
| --- | --- |
| Red | Ambient occlusion, read by `aoMap` |
| Green | Roughness, read by `roughnessMap` |
| Blue | Metalness, read by `metalnessMap` |

It's often called an **ORM** texture, for occlusion, roughness, metalness. Viewed as a picture it looks like nonsense colors, because each channel is a separate map.

**Analogy: a pill organizer.** One box, with separate compartments for morning, noon, and night. You don't carry three boxes, but you do have to open the right compartment.

Try the right packing, a texture packed in a different order, and a material that forgot its `metalness`. The strips in the corner are the texture's three channels.

<div data-scene="packed"></div>

## B · Working knowledge

### Using a packed texture

```js
const orm = await new TextureLoader().loadAsync('/textures/cabinet-orm.png');
material.aoMap = material.roughnessMap = material.metalnessMap = orm; // one texture, three channels
material.roughness = 1; // each map is multiplied by its number
material.metalness = 1; // the default, 0, would wipe the metalness map out
```

Each slot reads its own channel, and nothing is copied. Leave the texture at `NoColorSpace`, since it holds numbers, not colors. `GLTFLoader` sets `roughness` and `metalness` from the file, and already puts one shared texture in both `roughnessMap` and `metalnessMap`.

### When roughness looks wrong

If a finish is glossy where it should be matte, or the other way round, check the packing before the material. Some tools export a different channel order, and some store **smoothness**, the reverse of roughness. three.js always reads roughness from green, so repack the texture in your tool.

### Building one

In Blender, Substance, or an image tool, put AO, roughness, and metalness into red, green, and blue, and export without a color profile conversion, so the numbers stay as they are.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
