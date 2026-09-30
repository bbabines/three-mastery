---
id: 1.materials.tone-mapping.read-the-code.1
loop: 1
tier: core
concepts: [materials.tone-mapping]
mode: read-the-code
context: materials.tone-mapping/product-colors
lenses: []
misconceptions:
  - materials.tone-mapping/brand-colors
---

# Tone mapping and exposure

> **In short:** Tone mapping bends light brighter than white into the range a screen can show, and exposure turns the whole picture up or down first.
>
> **Used for:** Blown-out highlights on a product, brand colors that must stay true, bright HDR skies, and overall brightness.

## A · The basics

### Light has no ceiling, screens do

three.js lights in linear numbers, where 1 is the brightest white a screen can show. Light itself has no such limit: a surface facing a strong lamp can work out to 3, or 20. With tone mapping off, the default (`NoToneMapping`), everything above 1 is cut off at 1, so the brightest parts of a product turn into flat white patches with no detail, called **blown highlights**.

**Tone mapping** is a curve applied to every pixel's final color. It leaves dark and middle values nearly alone and bends the bright ones down gently, so 3 still comes out a little brighter than 2. **Exposure**, `renderer.toneMappingExposure`, multiplies every color just before the curve: above 1 is brighter, below 1 darker.

**Analogy: a phone camera in bright sun.** A cheap camera turns a white shirt in sunlight into a white blob; a good one keeps the folds by squeezing the bright range. Its exposure slider brightens or darkens the whole shot first.

Try each tone mapping on the brightly lit ball, then the exposure slider, and watch how much of the ball clips to white.

<div data-scene="highlights"></div>

### Every curve changes colors a little

A curve that bends bright values also touches the colors below them, and each curve does it differently. `ACESFilmicToneMapping` gives a film-like look with extra contrast, and shifts hue and saturation. `AgXToneMapping` handles very bright, saturated light gracefully, and washes strong colors toward pastel. `NeutralToneMapping` is built to keep product colors close to their source.

Switch the curve. The swatches on the left skip tone mapping; the ones on the right go through it.

<div data-scene="brandColors"></div>

## B · Working knowledge

### Turning it on

```js
renderer.toneMapping = NeutralToneMapping;
renderer.toneMappingExposure = 1; // 1 is neutral
```

Exposure needs a tone mapping: with `NoToneMapping`, three.js leaves the whole step out of the shader, exposure included. It's a renderer setting, and changing `toneMapping` rebuilds every material's shader program, so pick one at setup. Changing the exposure is free.

### Keeping a color exact

```js
logo.material.toneMapped = false; // skip the curve for this material
```

Labels, UI panels, and brand swatches usually want this, since their colors should reach the screen as set. A lit product that must stay on-brand gets `NeutralToneMapping` instead, with its lights tuned so the paint stays out of the curve's bright end.

### Render targets skip it

Tone mapping runs only when drawing to the canvas. A thumbnail rendered into a render target comes out without it, and an `OutputPass` at the end of an `EffectComposer` puts it back.

### Bright environments

An HDR environment stores a sky or studio lights at many times the brightness of white. Without tone mapping, reflections of it clip; with it, lower the exposure until the brightest reflections keep their shape.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
