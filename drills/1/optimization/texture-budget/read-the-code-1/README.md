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

> **In short:** A texture can't show more detail than the device pixels it covers, so size each one to fit and keep the total small.
>
> **Used for:** Swatch libraries of hundreds of fabrics, thumbnails in a product picker, a phone's memory, and texture sizes for artists.

## A · The basics

### Detail the screen can't show

A big texture is expensive: a 4096 × 4096 one holds about 89 MB on the GPU, with its mipmaps.

What reaches the screen is limited by the device pixels the surface covers. A swatch 300 device pixels across shows about 300 pixels of texture across, whatever the texture's size. With more, the GPU draws from a **mip level**, one of the smaller copies it keeps, picking the one closest to the size on screen. The full-size level still takes its memory and adds nothing you can see.

**Analogy: a photo printed as a stamp.** A 40-megapixel photo printed the size of a postage stamp looks the same as a 1-megapixel one. The extra pixels only take up space on the card.

Change the texture size and the distance. Up close, a small texture turns soft; far away, a big one looks no better than a small one.

<div data-scene="onScreen"></div>

### Many textures at once

A budget covers everything loaded at the same time: a picker of 60 swatches at 1024 × 1024 is about 335 MB before the rest of the scene. A phone's browser usually gives a page far less GPU memory than a desktop, and running out can lose the WebGL context or reload the tab.

## B · Working knowledge

### Size to the screen

Work out the largest size a surface appears on screen, in device pixels, and use the next size up. A thumbnail 120 CSS pixels across at a pixel ratio of 2 covers 240 device pixels, so 256 × 256 is enough.

### Share one texture, tint it with color

```js
const weave = await loader.loadAsync('weave-gray.png'); // one grayscale texture
const swatches = colors.map((color) => new MeshStandardMaterial({ color, map: weave }));
```

`material.color` multiplies the map, so one gray texture gives every color. Materials hold the texture rather than copying it, so they all share one upload. Try both ways on the swatch library, at each size.

<div data-scene="library"></div>

### Compress, and keep mipmaps where they help

A PNG or JPG is unpacked to 4 bytes a pixel on the GPU, whatever its file size. A KTX2 texture stays compressed there, often at a quarter of that or less. Mipmaps cost a third more and stop distant textures from shimmering. A texture always drawn at its own size, like a UI icon, can go without:

```js
icon.generateMipmaps = false;
icon.minFilter = LinearFilter;
```

### The device's limit

`renderer.capabilities.maxTextureSize` is the largest texture the device takes. three.js shrinks a bigger image to fit as it uploads it, and logs a warning, so the download and the resize were wasted.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
