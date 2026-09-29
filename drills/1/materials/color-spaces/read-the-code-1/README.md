---
id: 1.materials.color-spaces.read-the-code.1
loop: 1
tier: core
concepts: [materials.color-spaces]
mode: read-the-code
context: materials.color-spaces/washed-out
lenses: []
misconceptions:
  - materials.color-spaces/all-srgb
---

# Color spaces

> **In short:** A color space says what a color's numbers mean: three.js does its lighting in linear numbers, where twice the number is twice the light, while pictures, color pickers, and screens use sRGB, so color textures are marked sRGB, data maps are left unmarked, and the renderer converts the result to sRGB for the screen.
>
> **Used for:** Fixing product photos that come out pale and washed out; normal maps whose bumps light up wrong; matching a brand color from a designer's color picker exactly; and lightmaps and HDR files, which store light in linear numbers.

## A · The basics

### Two ways to write down a color

A color is three numbers, red, green, and blue, each from 0 to 1. What those numbers mean depends on the **color space**:

- **Linear:** the numbers are amounts of light. Twice the number is twice the light, so adding two lights is just adding their numbers. Lighting math only works this way.
- **sRGB:** the numbers follow a curve that spends more of them on dark shades, where eyes notice small differences. Image files, CSS colors, color pickers, and screens all use sRGB. Halfway gray in sRGB, `#808080`, is only about 0.22 in linear numbers.

three.js works in linear. Every color coming in from the sRGB world is converted to linear, lit, and then converted back to sRGB for the screen.

**Analogy: Fahrenheit and Celsius.** 20 means something very different in each. You can't average a reading in one with a reading in the other; convert first, do the math in one scale, and convert back to show it. Mix them up and nothing errors; the answer is just wrong.

### Color maps and data maps

A texture a material reads is called a **map**. Some maps hold colors and some hold numbers that only look like colors:

| Map | Holds | Mark it |
| --- | --- | --- |
| `map`, `emissiveMap` | Colors, painted or photographed | `SRGBColorSpace` |
| `normalMap` | Directions (the tangent space page) | Leave `NoColorSpace` |
| `roughnessMap`, `metalnessMap`, `aoMap` | Amounts from 0 to 1 | Leave `NoColorSpace` |

A texture you make yourself starts at `NoColorSpace`, which means "read the numbers as they are." For a color map, that's wrong: its sRGB numbers are used as if they were linear, then converted to sRGB again on the way out, so every color comes out paler. For a data map it's right, and marking it sRGB bends every number it holds.

Switch each map's color space. The small picture in the corner is the label as the 2D canvas painted it.

<div data-scene="maps"></div>

<details>
<summary>The math, if you're curious</summary>

The curve is the **sRGB transfer function**, often loosely called **gamma**. Roughly, linear = sRGB<sup>2.2</sup>, so 0.5 in sRGB is about 0.5<sup>2.2</sup> ≈ 0.22 in linear. The exact curve has a short straight piece near black; the `SRGBToLinear` function in three.js's `ColorManagement.js` uses it.

</details>

## B · Working knowledge

### Loading a color texture yourself

```js
const label = await new TextureLoader().loadAsync('/textures/label.png');
label.colorSpace = SRGBColorSpace;
material.map = label;
```

- **GLTFLoader already does this** for the color maps in a model (`map` and `emissiveMap`) and leaves the data maps alone. Only textures you load or make yourself need it: `TextureLoader`, `CanvasTexture`, `DataTexture`.
- **Set it before the texture is first drawn.** The color space decides how the texture is sent to the GPU, so changing it later needs `texture.needsUpdate = true`.

### Matching a color picker

A designer hands you `#e4572e`. CSS colors and color pickers are sRGB, and `Color.set` expects that:

```js
material.color.set('#e4572e');                       // right: read as sRGB, stored as linear
material.color.setRGB(228 / 255, 87 / 255, 46 / 255); // wrong: read as linear, shows as #f39e76
material.color.setRGB(0.894, 0.341, 0.18, SRGBColorSpace); // right
```

- `material.color.r` gives the stored linear number, 0.776 here, not 0.894. Use `getHexString()` or `getStyle()` to get sRGB back out.
- On an unlit `MeshBasicMaterial`, `set('#e4572e')` shows exactly `#e4572e` on screen. A lit material shows it changed by the light, as it should; tone mapping changes it too (the tone mapping page).

Try the three lines on the swatch. The square in the readout is the browser's own CSS `#e4572e`.

<div data-scene="picker"></div>

### The last step: output

```js
renderer.outputColorSpace = SRGBColorSpace; // the default: leave it
```

Setting it to `LinearSRGBColorSpace` sends linear numbers straight to a screen that reads them as sRGB, so the whole picture looks too dark. A render target is different: three.js keeps it linear, and the output conversion happens when the final picture reaches the canvas (the render targets page, in the GPU domain).

### Which color space is it in?

| Value | Color space |
| --- | --- |
| A hex code, a CSS color, a color picker's numbers | sRGB |
| `material.color` as stored, and `color.r`, `.g`, `.b` | Linear |
| What `color.set(hex)` expects and `getHexString()` gives back | sRGB |
| What `color.setRGB(r, g, b)` expects | Linear, unless the fourth argument says `SRGBColorSpace` |
| A color map (`map`, `emissiveMap`) | sRGB, once marked `SRGBColorSpace` |
| A data map (`normalMap`, `roughnessMap`, `metalnessMap`, `aoMap`) | Not a color: `NoColorSpace` |
| The lighting math | Linear |
| What reaches the screen | sRGB, through `renderer.outputColorSpace` |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
