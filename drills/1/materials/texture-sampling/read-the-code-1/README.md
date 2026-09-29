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

> **In short:** Sampling is how the GPU picks a texture's color for each pixel: filtering blends neighboring texels, mipmaps are smaller copies it reads when the texture is far away, anisotropic filtering keeps it sharp at grazing angles, and wrapping, repeat, and flipY decide where each UV lands in the image.
>
> **Used for:** Floors, roads, and fabric patterns that stay calm instead of shimmering as the camera moves; tiling one small texture across a whole warehouse floor; crisp pixel-art icons and UI; and textures that come out upside down on a model.

## A · The basics

### A texture's pixels rarely match the screen's

A pixel of a texture is called a **texel**. Up close, one texel covers many screen pixels; far away, one screen pixel covers many texels. Either way the GPU has to decide what color each screen pixel gets, which is called **sampling**. Two settings decide it:

- **`magFilter`**, for up close: `LinearFilter` (the default) blends the nearest texels smoothly; `NearestFilter` takes just one, so each texel shows as a sharp square.
- **`minFilter`**, for far away: here one pixel should show the average of many texels, but reading one or four of them picks an effectively random color, which changes as the camera moves. That flicker is **shimmer**, or **aliasing**.

**Mipmaps** fix that. They're smaller copies of the texture, each half the size of the last, averaged ahead of time. Far away, the GPU reads the copy whose texels match the pixel size, so each pixel gets a proper average. three.js makes them when the texture uploads, and the default `minFilter`, `LinearMipmapLinearFilter`, uses them. So mipmaps aren't only a speed trick: without them, distant patterns sparkle and crawl.

**Analogy: a newspaper photo.** Up close you see the dots; at arm's length they blur into shades of gray. Looking at the dots through a tiny pinhole from across the room shows a random dot, black or white. Mipmaps are like printing a smaller, pre-blurred copy for viewing from far away.

At grazing angles the texture is squashed in one direction only, and ordinary mipmaps blur it in both. **Anisotropic filtering** (`anisotropy`) reads extra texels along the squashed direction, keeping it sharp.

Try each setting on the scrolling floor. Watch the far half.

<div data-scene="shimmer"></div>

## B · Working knowledge

### A tiled floor that stays calm

```js
floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping; // the UVs page covers wrapping
floorTexture.repeat.set(20, 20);
floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // often 16; 1 is the default
```

- **Keep the default `minFilter`.** Switching to `LinearFilter` saves the mipmaps' extra third of GPU memory, and makes the floor shimmer.
- **Set these before the first draw.** Filters, wrapping, and anisotropy go to the GPU with the image; changing them later needs `texture.needsUpdate = true`.
- `anisotropy` costs a little GPU work, at grazing angles only, so floors, roads, and long walls usually get it turned up.

### Crisp UI and pixel art

```js
icon.magFilter = NearestFilter;  // big, sharp squares when magnified
icon.minFilter = NearestFilter;
icon.generateMipmaps = false;     // no mipmaps needed without a mipmap filter
```

For pixel art, or a lookup table where blending neighbors would mix unrelated values. A `DataTexture` starts with `NearestFilter` for that reason. For text drawn on a canvas, make the canvas as many pixels as the text covers on screen (times the pixel ratio), so neither filter has much to do.

### flipY

`texture.flipY` (default `true`) flips an image as it uploads, because images store their top row first and three.js's UVs put v = 0 at the bottom. `GLTFLoader` sets `flipY = false` to match how glTF lays out UVs, so a texture you load yourself for a glTF model needs the same, or it lands upside down. It has no effect on an `ImageBitmap`, which has to be flipped when it's created.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
