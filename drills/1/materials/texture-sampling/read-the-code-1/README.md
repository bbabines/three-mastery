---
id: 1.materials.texture-sampling.read-the-code.1
loop: 1
tier: light
concepts: [materials.texture-sampling]
mode: read-the-code
context: materials.texture-sampling/grazing-shimmer
lenses: []
misconceptions:
  - materials.texture-sampling/mipmaps-performance
---

# Texture sampling

> **In short:** Sampling is how the GPU picks a texture's color for each screen pixel, whether the texture is up close or far away.
>
> **Used for:** Floors that don't shimmer, one tile repeated across a warehouse, crisp pixel-art icons, and textures that land upside down.

## A · The basics

### Texture pixels rarely match screen pixels

A pixel of a texture is called a **texel**. Up close, one texel covers many screen pixels; far away, one screen pixel covers many texels. Either way the GPU has to pick each pixel's color, which is called **sampling**. Up close, `magFilter` decides: the default, `LinearFilter`, blends the nearest texels smoothly, and `NearestFilter` shows each texel as a sharp square. Far away, `minFilter` decides.

### Far away: mipmaps

Far away, one pixel should show the average of many texels, but reading just a few of them picks an effectively random color, which changes as the camera moves. That flicker is called shimmer. **Mipmaps** fix it: smaller copies of the texture, each half the size of the last, averaged ahead of time, so the GPU reads the copy whose texels match the pixel size. three.js makes them when the texture uploads, and the default `minFilter` uses them, so mipmaps aren't only a speed trick.

**Analogy: a newspaper photo.** At arm's length its dots blur into shades of gray, but through a pinhole from across the room you see one random dot, black or white. Mipmaps are a smaller, pre-blurred copy printed for viewing from far away.

At grazing angles the texture is squashed in one direction only, and `anisotropy` reads extra texels along that direction to keep it sharp. Try each setting on the scrolling floor and watch the far half.

<div data-scene="shimmer"></div>

## B · Working knowledge

### A tiled floor that stays calm

```js
floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
floorTexture.repeat.set(20, 20);
floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // 1 is the default
```

Keep the default `minFilter`: switching to `LinearFilter` saves the mipmaps' memory and makes the floor shimmer. Set these before the first draw, since changing them later needs `texture.needsUpdate = true`.

### Crisp UI and pixel art

```js
icon.magFilter = NearestFilter; // big, sharp squares when magnified
icon.minFilter = NearestFilter;
icon.generateMipmaps = false;
```

Use it for pixel art, or for a lookup table, where blending neighbors would mix unrelated values; a `DataTexture` starts with `NearestFilter` for that reason.

### Upside-down textures: flipY

`texture.flipY`, `true` by default, flips an image as it uploads. `GLTFLoader` sets it to `false` to match how glTF lays out UVs, so a texture you load yourself for a glTF model needs `flipY = false` too, or it lands upside down.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
