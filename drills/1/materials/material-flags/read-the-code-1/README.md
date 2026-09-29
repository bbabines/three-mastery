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

> **In short:** A few material settings change how the GPU draws a surface rather than how it's lit: which sides of each triangle are drawn (`side`), whether it's blended as see-through (`transparent`), whether pixels below an alpha threshold are thrown away (`alphaTest`), whether it writes to the depth buffer (`depthWrite`), and whether its depth is nudged so it wins against a surface in the same place (`polygonOffset`).
>
> **Used for:** Logos and labels stuck onto a product's surface; perforated metal, mesh fences, and leaves cut out of a texture; single-sheet surfaces like a cloth, a sign, or the inside of a cup; and glass and fades that layer over each other.

## A · The basics

### Settings for the drawing, not the lighting

Most material settings change how a surface is lit. These five change how the GPU draws it, the steps the GPU pipeline pages in Domain 10 walk through:

| Flag | Default | What it does |
| --- | --- | --- |
| `side` | `FrontSide` | Which faces are drawn: `FrontSide`, `BackSide`, or `DoubleSide` (the winding order page) |
| `transparent` | `false` | Blend the surface over what's behind it, using its opacity and alpha |
| `alphaTest` | `0` | Throw away pixels whose alpha is below this, leaving clean holes |
| `depthWrite` | `true` | Record the surface's depth, so things behind it are hidden |
| `polygonOffset` | `false` | Nudge the surface's depth, to win against a surface in the same place |

**Analogy: a print shop's job ticket.** The artwork decides what the poster looks like; the ticket says print both sides or one, cut out the holes, laminate it, stack it on top. Same artwork, different handling, different cost.

Try each flag on the three exhibits: a logo stuck onto a panel, a perforated panel with a ball behind it, and a thin cup seen from above.

<div data-scene="flags"></div>

## B · Working knowledge

### Thin surfaces: side

```js
cup.material.side = DoubleSide; // draw the inside of an open, single-layer mesh too
```

- **`DoubleSide` isn't free.** The GPU normally skips triangles facing away, which is about half of a closed shape; `DoubleSide` shades them all. A transparent `DoubleSide` material is drawn twice, back faces then front, unless `forceSinglePass: true`.
- Use it for open, single-layer meshes: a sheet, a leaf, a cup modeled as one surface. A closed model that needs it usually has flipped triangles, which the winding order page covers.
- `side` also decides what a raycast can hit: a `FrontSide` mesh can't be clicked from behind.

### Perforated panels: alphaTest or transparent

```js
const panel = new MeshStandardMaterial({ map: holesTexture, alphaTest: 0.5 }); // clean cutouts
const glass = new MeshStandardMaterial({ color: '#9cc3e6', transparent: true, opacity: 0.3 });
```

- **A texture's alpha does nothing on its own.** With neither flag, the holes draw as solid color.
- **`alphaTest`** keeps the surface opaque and cuts hard-edged holes: no sorting, no blending. Right for perforated metal, fences, and leaves.
- **`transparent: true`** blends, for soft edges and see-through glass. three.js sorts transparent objects back to front, per object, and draws them after the opaque ones; the blending and transparency page covers what goes wrong.

### Overlapping see-through layers: depthWrite

```js
smoke.material = new MeshBasicMaterial({ map: puff, transparent: true, depthWrite: false });
```

three.js leaves `depthWrite` on even for transparent materials, so a see-through layer drawn first can hide one behind it. For layered effects like smoke, sparks, or overlapping glass panes, turn it off.

### Decals: polygonOffset

```js
const logo = new MeshBasicMaterial({ map: logoTexture, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
```

Two surfaces in exactly the same place have nearly equal depths, and which one wins flips from pixel to pixel, so the logo flickers through the panel: **z-fighting**. A negative offset pulls the logo's depth toward the camera, so it always wins, without moving it. Lifting it off the surface a little works too, but shows a gap up close.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
