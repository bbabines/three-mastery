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

> **In short:** The same color numbers mean different things in sRGB, which images and screens use, and linear, where three.js does its lighting.
>
> **Used for:** Washed-out product photos, normal maps that light wrong, matching a designer's colors, and HDR files.

## A · The basics

### Two ways to write down a color

A color is three numbers, red, green, and blue, each from 0 to 1. What those numbers mean depends on the **color space**:

- **Linear:** the numbers are amounts of light. Twice the number is twice the light, which is what lighting math needs.
- **sRGB:** the numbers follow a curve that spends more of them on dark shades, where eyes notice small differences. Image files, CSS colors, color pickers, and screens all use sRGB. Halfway gray in sRGB, `#808080`, is only about 0.22 in linear.

three.js works in linear. Colors coming in from the sRGB world are converted to linear, lit, and converted back to sRGB for the screen.

**Analogy: Fahrenheit and Celsius.** 20 means something very different in each, so you convert first, do the math in one scale, and convert back to show it. Mix them up and nothing errors; the answer is just wrong.

### Color maps and data maps

A texture a material reads is called a map. A **color map**, like `map` or `emissiveMap`, holds colors and is marked `SRGBColorSpace`. A **data map**, like `normalMap`, `roughnessMap`, `metalnessMap`, or `aoMap`, holds numbers that only look like colors, and stays at `NoColorSpace`, which means "read the numbers as they are."

A texture you make yourself starts at `NoColorSpace`. For a color map that's wrong: its sRGB numbers are used as if they were linear, then converted to sRGB again on the way out, so every color comes out paler. Marking a data map sRGB is wrong the other way: it bends every number the map holds.

Switch each map's color space, and compare the label with the picture in the corner.

<div data-scene="maps"></div>

<details>
<summary>The math, if you're curious</summary>

The curve is the **sRGB transfer function**, often loosely called gamma. Roughly, linear = sRGB<sup>2.2</sup>, so 0.5 in sRGB is about 0.5<sup>2.2</sup> ≈ 0.22 in linear.

</details>

## B · Working knowledge

### Loading a color texture yourself

```js
const label = await new TextureLoader().loadAsync('/textures/label.png');
label.colorSpace = SRGBColorSpace;
material.map = label;
```

`GLTFLoader` already marks a model's color maps and leaves its data maps alone, so only textures you load or make yourself need this. Set it before the texture is first drawn, or add `texture.needsUpdate = true`.

### Matching a color picker

CSS colors and color pickers are sRGB, and `Color.set` expects that:

```js
material.color.set('#e4572e');                             // right: read as sRGB
material.color.setRGB(228 / 255, 87 / 255, 46 / 255);      // wrong: read as linear, shows as #f39e76
material.color.setRGB(0.894, 0.341, 0.18, SRGBColorSpace); // right
```

`material.color.r` gives back the stored linear number, not the picker's; `getHexString()` gives sRGB. Try the three lines on the swatch.

<div data-scene="picker"></div>

### The last step: output

```js
renderer.outputColorSpace = SRGBColorSpace; // the default: leave it
```

Set to `LinearSRGBColorSpace`, it sends linear numbers straight to a screen that reads them as sRGB, so the whole picture looks too dark.

### Which color space is it in?

| Value | Color space |
| --- | --- |
| A hex code, or a color picker's numbers | sRGB |
| A color map, marked `SRGBColorSpace` | sRGB |
| `material.color`, `color.r`, and the lighting math | Linear |
| What reaches the screen | sRGB |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
