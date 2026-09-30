---
id: 1.materials.material-flags.read-the-code.1
loop: 1
tier: light
concepts: [materials.material-flags]
mode: read-the-code
context: materials.material-flags/perforated
lenses: []
misconceptions:
  - materials.material-flags/doubleside-free
---

# Pipeline-facing material flags

> **In short:** Some material settings change how the GPU draws a surface rather than how it's lit, and each one has a cost.
>
> **Used for:** Logos stuck onto a product, perforated metal and leaves, thin sheets like cloth, and layered glass.

## A · The basics

### Settings for the drawing, not the lighting

Most material settings change how a surface is lit. A few change how the GPU draws it: which of its faces get drawn, whether it's blended over what's behind it, whether some of its pixels are thrown away, and how its depth, its distance from the camera, hides or is hidden by other surfaces.

**Analogy: a print shop's job ticket.** The artwork decides what the poster looks like; the ticket says print one side or both, cut out the holes, stack it on top. Same artwork, different handling, different cost.

| Flag | What it does |
| --- | --- |
| `side` | Which faces are drawn: `FrontSide`, `BackSide`, or `DoubleSide` |
| `transparent` | Blends the surface over what's behind it |
| `alphaTest` | Throws away pixels whose alpha is below it |
| `depthWrite` | Records the surface's depth, hiding what's behind |
| `polygonOffset` | Nudges its depth, to win against a surface in the same place |

Try each flag on the three exhibits: a logo on a panel, a perforated panel with a ball behind it, and a thin cup.

<div data-scene="flags"></div>

## B · Working knowledge

### Thin surfaces: side

```js
cup.material.side = DoubleSide; // draw the inside of an open, single-layer mesh too
```

`DoubleSide` isn't free. The GPU normally skips triangles facing away, about half of a closed shape, and `DoubleSide` shades them all; a transparent `DoubleSide` material is drawn twice, back faces first. Use it for open, single-layer meshes like a sheet or a leaf; a closed model that needs it usually has flipped triangles.

### Perforated panels: alphaTest or transparent

```js
const panel = new MeshStandardMaterial({ map: holesTexture, alphaTest: 0.5 }); // clean cutouts
const glass = new MeshStandardMaterial({ color: '#9cc3e6', transparent: true, opacity: 0.3 });
```

A texture's alpha does nothing on its own: with neither flag, the holes draw solid. `alphaTest` keeps the surface opaque and cuts hard-edged holes, with no sorting, which suits perforated metal, fences, and leaves. `transparent: true` blends, for soft edges and glass, and three.js draws those objects after the opaque ones, sorted back to front.

### Layered see-through effects: depthWrite

```js
smoke.material = new MeshBasicMaterial({ map: puff, transparent: true, depthWrite: false });
```

`depthWrite` stays on even for transparent materials, so a see-through layer drawn first can hide one behind it. Turn it off for smoke, sparks, or overlapping panes.

### Decals: polygonOffset

```js
const logo = new MeshBasicMaterial({ map: logoTexture, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
```

Two surfaces in exactly the same place fight over each pixel, so the logo flickers through the panel: **z-fighting**. A negative offset pulls the logo's depth toward the camera, so it always wins, without moving it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
