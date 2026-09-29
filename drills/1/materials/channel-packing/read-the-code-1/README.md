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

> **In short:** Channel packing stores several grayscale maps in one texture, one in each of its red, green, and blue channels: glTF puts roughness in green and metalness in blue, ambient occlusion often shares the same texture in red, and three.js's materials read exactly those channels.
>
> **Used for:** Reading the odd-colored texture that comes inside most glTF models; packing maps yourself when you export from Blender or Substance; tracking down a finish that's glossy where it should be matte; and saving downloads and GPU memory on texture-heavy models.

## A · The basics

### Three grayscale maps in one texture

Roughness, metalness, and ambient occlusion are each one number per texel, a grayscale image. A texture has room for four numbers per texel: red, green, blue, and alpha. Storing each grayscale map in its own channel packs three maps into one texture. glTF's layout, and three.js's, is:

| Channel | Holds | Read by |
| --- | --- | --- |
| Red | Ambient occlusion (the baked lighting page) | `aoMap` |
| Green | Roughness | `roughnessMap` |
| Blue | Metalness | `metalnessMap` |

It's often called an **ORM** texture, for occlusion, roughness, metalness, in channel order. Viewed as a picture it looks like nonsense colors, because it isn't a picture: each channel is a separate map.

**Analogy: a pill organizer.** One box, with separate compartments for morning, noon, and night. You don't carry three boxes, but you do have to open the right compartment.

The strips in the corner are the packed texture's three channels, shown one at a time. Try the right packing, a texture packed in a different order, and a material that forgot its `metalness`.

<div data-scene="packed"></div>

## B · Working knowledge

### Using a packed texture

```js
const orm = await new TextureLoader().loadAsync('/textures/cabinet-orm.png');
material.aoMap = material.roughnessMap = material.metalnessMap = orm; // one texture, three channels
material.roughness = 1; // each map is multiplied by its number
material.metalness = 1; // the default is 0, which would wipe the metalness map out
```

- **One texture object, three slots.** Each slot reads its own channel; nothing is copied.
- **Leave it at `NoColorSpace`.** It holds numbers, not colors (the color spaces page).
- **Set the numbers to 1.** `GLTFLoader` sets `roughness` and `metalness` from the file, where both default to 1; a material you make yourself starts at `metalness: 0`.
- A model from `GLTFLoader` already shares one texture between `roughnessMap` and `metalnessMap`, so `material.roughnessMap === material.metalnessMap` is `true`.

### When roughness looks wrong

If a finish is glossy where it should be matte, or the other way round, check the packing before the material. Some tools and engines export a different channel order, and some store **smoothness**, the reverse of roughness, which reads as glossy where the surface should be rough. three.js always reads roughness from green; repack the texture in your tool, or fix it in a shader (the extending materials page, in the shaders domain).

### Building one

In Blender, Substance, or an image tool, put AO, roughness, and metalness into red, green, and blue, and export without a color profile conversion, so the numbers stay as they are. glTF exporters pack roughness and metalness this way for you.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
