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

> **In short:** Every see-through layer is shaded at every pixel it covers, however faint, so overdraw is cut by using fewer and smaller layers, hiding a layer that isn't needed instead of fading it to nothing, and using alphaTest cutouts instead of blending where edges can be hard.
>
> **Used for:** Glass display cases and windows in a product viewer; fades, flashes, and tinted full-screen overlays; smoke, dust, and fog built from stacked layers; and perforated metal, fences, and leaves.

## A · The basics

### Layers the depth test can't skip

The pipeline stages page named **overdraw**: shading the same pixel more than once in a frame. For solid objects the depth test keeps it low: drawn front to back, fragments hidden behind something already drawn are thrown away early (the depth buffer and early-z page). See-through layers get none of that. They're drawn after everything solid, back to front, often with depth writes turned off (the blending page), and each one is shaded and blended at every pixel it covers. A layer at 10% opacity costs the same as a solid one, and a layer at 0% costs it too.

**Analogy: coats of varnish.** Each coat is brushed over the whole panel, however thin it is. Eight thin coats take eight times the brushing of one thicker coat, for about the same finish.

Eight thin fog layers hang in front of a product, and a full-screen overlay, faded out to opacity 0, sits in front of the camera. In the **overdraw view**, each fragment drawn adds a little light, so a pixel's brightness shows how many times it was shaded. Swap in one thicker fog layer, and hide the overlay instead of fading it: the normal view barely changes, and the overdraw view goes dark.

<div data-scene="layers"></div>

## B · Working knowledge

### Hide it, don't fade it to nothing

```js
flash.material.opacity = 0; // still drawn: a full screen of pixel work
flash.visible = false;      // skipped: no draw call, no pixels
```

When a fade out ends, set `visible = false`, and set it back to `true` before the next fade in.

### Fewer, smaller layers

- **Stack less.** Layers of one color in front of everything look the same as a single layer whose opacity adds them up: eight at 0.1 match one at about 0.57.
- **Trim what's clear.** A soft, round smoke puff on a square plane is shaded over the whole square, clear corners included. A shape cut closer to the visible part, like an octagon, shades fewer pixels for the same look.
- **Keep full-screen layers few.** Each one is a full screen of pixel work at the pixel ratio's square, like a post-processing pass (the multi-pass and post-processing page).

### Cutouts: alphaTest instead of blending

```js
panel.material = new MeshStandardMaterial({ map: perforatedMetal, alphaTest: 0.5 }); // no transparent: true
```

- Hard-edged holes, in perforated metal, a fence, or leaves, don't need blending. With `alphaTest`, fragments whose alpha is under 0.5 are thrown away and the rest are solid: the panel writes depth, needs no back-to-front sorting, and hides what's behind its solid parts.
- **The holes aren't free.** The throwing away happens inside the fragment shader, so every hole is shaded first, and as a rule of thumb a material that can discard can lose early-z (the depth buffer and early-z page). Many cutout layers stacked up can still be slow.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
