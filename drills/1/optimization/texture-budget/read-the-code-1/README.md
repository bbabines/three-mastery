---
id: 1.optimization.texture-budget.read-the-code.1
loop: 1
tier: core
concepts: [optimization.texture-budget]
mode: read-the-code
context: optimization.texture-budget/thumbnail-textures
lenses: []
misconceptions:
  - optimization.texture-budget/always-sharper
---

# Texture budget

> **In short:** A texture can't show more detail than the pixels it covers on screen, so a texture budget sizes each texture to its on-screen need, shares and compresses what it can, and keeps the total within what the weakest target device can hold.
>
> **Used for:** A swatch library of hundreds of fabrics and finishes; product thumbnails in a grid or a picker; fitting a configurator into a phone's memory; and telling the artists what size to make each texture.

## A · The basics

### Detail the screen can't show

The runtime memory math page put a price on a texture: width × height × 4 bytes, plus a third for mipmaps. A 4096 × 4096 texture holds about 89 MB on the GPU; a 1024 × 1024 one, about 5.6 MB.

What reaches the screen is limited by the device pixels the surface covers (the resolution and DPR page). A swatch 300 device pixels across can show about 300 pixels of texture across, whatever the texture's size. When the texture has more, the GPU draws from one of its mip levels, the smaller copies it keeps, picking the one closest to the size on screen (the texture sampling page, in the materials domain, covers mip levels). The full-size level still takes its memory, and adds nothing you can see.

**Analogy: a photo printed as a stamp.** A 40-megapixel photo printed the size of a postage stamp looks the same as a 1-megapixel one. The extra pixels only take up space on the card.

Change the texture's size and the swatch's distance. The readout compares the texture with the pixels the swatch covers. Up close, a small texture turns soft; far away, a big one looks the same as a texture a fraction of its size.

<div data-scene="onScreen"></div>

### Many textures at once

A budget is about everything loaded at the same time. A picker of 60 swatches at 1024 × 1024 is 60 × 5.6 MB, about 335 MB, before the rest of the scene. As a rule of thumb, a phone's browser gives a page far less GPU memory than a desktop does, and running out can lose the WebGL context or reload the tab (the runtime memory math page).

## B · Working knowledge

### Size to the screen

Work out the largest size a surface will appear on screen, in device pixels, and use the next size up. A thumbnail 120 CSS pixels across at a pixel ratio of 2 covers 240 device pixels, so 256 × 256 is enough. A product texture that can fill a laptop screen may earn 2048.

### Share one texture, tint it with color

```js
const weave = await loader.loadAsync('weave-gray.png');          // one grayscale detail texture
const swatches = colors.map((color) => new MeshStandardMaterial({ color, map: weave }));
```

- `material.color` multiplies the map, so one gray texture gives every color.
- Materials hold the texture, they don't copy it: all of them share one upload. Load each file once, too (the reuse and caching page).
- `texture.clone()` shares the image, and three.js keeps one copy on the GPU while the clones' settings match, even with a different `offset` or `repeat`.

Try both ways on a swatch library, at each size.

<div data-scene="library"></div>

### Compress, and keep mipmaps where they help

- **KTX2 textures stay compressed on the GPU**, where a PNG or JPG is unpacked to 4 bytes a pixel. `TextureUtils.getByteLength` gives each format's size: ASTC is a quarter of 8-bit RGBA (the KTX2 and Basis textures page).
- **Mipmaps cost a third more** and stop distant textures from shimmering. A texture always drawn at exactly its own size, like a UI icon, can go without: `generateMipmaps = false` with `minFilter = LinearFilter`.

### The device's limit

`renderer.capabilities.maxTextureSize` is the largest texture the device takes. three.js shrinks a bigger image to fit when it uploads it, and logs a warning: the download and the resize were wasted, so ship sizes the target devices can use.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
