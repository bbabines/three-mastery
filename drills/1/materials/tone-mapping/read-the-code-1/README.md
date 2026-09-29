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

> **In short:** Tone mapping squeezes the brightness of a lit scene, which can go far past what a screen can show, into the screen's range, and exposure brightens or darkens everything just before it; three.js leaves tone mapping off by default.
>
> **Used for:** Keeping the shine on a lit product from blowing out to flat white; product viewers where the paint color has to stay close to the brand's; outdoor and HDR scenes whose sky is many times brighter than white; and a brightness setting for the whole scene, like a camera's exposure dial.

## A · The basics

### Light has no ceiling, screens do

The color spaces page showed that three.js lights in linear numbers, where 1 is the brightest white a screen can show. Light itself has no such limit: a surface facing a strong lamp can work out to 3, or 20. With tone mapping off, the default (`NoToneMapping`), everything above 1 is cut off at 1, so the brightest parts of a product turn into flat white patches with no detail. That cut-off is called **clipping**, and those patches are **blown highlights**.

**Tone mapping** is a curve applied to every pixel's final color. It leaves dark and middle values nearly alone and bends the bright ones down gently, so a value of 3 still comes out a little brighter than 2 instead of both hitting the ceiling. **Exposure**, `renderer.toneMappingExposure`, multiplies every color just before the curve: above 1 brighter, below 1 darker.

**Analogy: a phone camera in bright sun.** Point it at a white shirt in sunlight and a cheap camera shows a white blob. A good one keeps the folds visible by compressing the bright range, and its exposure slider brightens or darkens the whole shot first.

Try each tone mapping on the brightly lit ball, then the exposure slider. The readout measures how much of the ball has clipped to pure white.

<div data-scene="highlights"></div>

### Every curve changes colors a little

A curve that bends bright values also touches the colors below them, and each curve does it differently:

- `ACESFilmicToneMapping` is built for a film-like look with extra contrast, and shifts hue and saturation.
- `AgXToneMapping` is built to handle very bright, saturated light gracefully, and washes strong colors toward pastel.
- `NeutralToneMapping` is built to keep product colors close to their source. Below its highlights it takes a small, equal amount off all three channels, which mostly shows in the darkest one.

The swatches below are unlit. On the left, each has `toneMapped: false`, so it's the source color; on the right, the same color goes through the curve. The readout reads the colors back off the screen.

<div data-scene="brandColors"></div>

## B · Working knowledge

### Turning it on

```js
renderer.toneMapping = NeutralToneMapping;
renderer.toneMappingExposure = 1; // 1 is neutral
```

- **Exposure needs a tone mapping.** With `NoToneMapping`, `toneMappingExposure` does nothing at all: three.js leaves the whole tone mapping step out of the shader.
- **It's per renderer**, not per scene or per material. Changing `toneMapping` rebuilds every material's shader program on the next render, so pick one at setup. Changing the exposure is free.
- `LinearToneMapping`, `ReinhardToneMapping`, and `CineonToneMapping` also exist; the three above are the usual choices today.

### Keeping a color exact

```js
logo.material.toneMapped = false; // skip the curve for this material
```

Labels, UI panels, and brand swatches usually want this: they're unlit, and their colors should reach the screen as set. It's a material setting, so a lit product that must stay on-brand gets `NeutralToneMapping` for the scene instead, with its lights tuned so the paint isn't pushed into the curve's bright end.

### Where it happens

Tone mapping runs at the end of each material's shader, and only when drawing to the canvas. Drawing into a render target skips it, so a thumbnail rendered into a target comes out without it. With an `EffectComposer`, an `OutputPass` at the end puts it back; the multi-pass and post-processing page, in the GPU domain, covers that.

### Bright environments

An HDR environment, the kind the environment maps page loads, stores a sky or studio lights at many times the brightness of white. Without tone mapping, reflections of it clip; with it, lower the exposure until the brightest reflections keep their shape.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
