---
id: 1.optimization.overdraw.read-the-code.1
loop: 1
tier: light
concepts: [optimization.overdraw]
mode: read-the-code
context: optimization.overdraw/full-screen-overlays
lenses: []
misconceptions:
  - optimization.overdraw/hidden-free
---

# Overdraw reduction

> **In short:** See-through layers are shaded at every pixel they cover, however faint, so use fewer and smaller ones.
>
> **Used for:** Glass display cases in a viewer, full-screen fades and flashes, layered fog, and perforated metal panels.

## A · The basics

### Layers the depth test can't skip

**Overdraw** is the fragment shader running more times than there are pixels: the same pixel shaded more than once in a frame. For solid objects, the depth test keeps it low by throwing away fragments hidden behind something already drawn.

See-through layers get none of that. They're drawn after everything solid, back to front, and each one is shaded and blended at every pixel it covers. A layer at 10% opacity costs as much as a solid one, and so does a layer at 0%.

**Analogy: coats of varnish.** Each coat is brushed over the whole panel, however thin it is. Eight thin coats take eight times the brushing of one thicker coat, for about the same finish.

Turn on the overdraw view, where brighter means shaded more times. Then swap in one thicker fog layer, and hide the flash instead of fading it.

<div data-scene="layers"></div>

## B · Working knowledge

### Hide it, don't fade it to nothing

```js
flash.material.opacity = 0; // still drawn: a full screen of pixel work
flash.visible = false;      // skipped: no draw call, no pixels
```

When a fade out ends, set `visible = false`, and set it back to `true` before the next fade in.

### Fewer, smaller layers

Layers of one color stacked in front of everything look the same as a single layer whose opacity adds them up: eight at 0.1 match one at about 0.57. A soft smoke puff on a square plane is shaded over the whole square, so a shape cut closer to the puff shades fewer pixels for the same look. And keep full-screen layers few: each one is a full screen of pixel work, like a post-processing pass.

### Cutouts: alphaTest instead of blending

```js
panel.material = new MeshStandardMaterial({ map: perforatedMetal, alphaTest: 0.5 }); // no transparent: true
```

Hard-edged holes, in perforated metal, a fence, or leaves, don't need blending. With `alphaTest`, fragments whose alpha is under 0.5 are thrown away and the rest are solid, so the panel writes depth and needs no sorting. The holes aren't free, though: they're thrown away inside the fragment shader, after being shaded, and a material that can throw fragments away usually loses early-z (the depth buffer and early-z page).

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
