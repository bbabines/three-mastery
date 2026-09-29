---
id: 1.gpu.blending.read-the-code.1
loop: 1
tier: core
concepts: [gpu.blending]
mode: read-the-code
context: gpu.blending/glass
lenses: []
misconceptions:
  - gpu.blending/per-triangle
---

# Blending and transparency

> **In short:** A see-through surface is mixed with whatever is already drawn behind it, so it only looks right if that was drawn first, and three.js can only put things in that order object by object, not triangle by triangle.
>
> **Used for:** Glass panels and display cases in a product viewer; fading a part in or out of a configurator; highlights and overlays drawn over a scene; and smoke, sparks, and decals.

## A · The basics

### Mixing with what's already there

For a solid surface, each fragment that passes the depth test simply replaces the pixel's color. For a see-through one, **blending** mixes the two instead: with `opacity: 0.3`, the result is 30% the glass's color and 70% whatever color the pixel already had. So the result depends on what was already drawn there. Anything drawn behind the glass *after* the glass can't show through it: the glass was mixed with the background, and the later object is then drawn over it or, if the glass wrote its depth, rejected behind it.

That's why three.js draws every opaque object first, then the transparent ones from back to front (the state changes and sorting page). A material is only treated as see-through when you say so: `transparent: true` turns blending on and moves it to the transparent list.

**Analogy: a watercolor glaze.** A glaze is a thin, see-through wash that tints whatever is already painted under it. Paint the sky after the glaze and the sky simply covers it. Glazes work only when you paint back to front.

### Sorted per object, not per triangle

three.js sorts transparent objects by each one's center, the center of its bounding sphere, every frame. Inside one mesh there's no sorting at all: one draw call draws its triangles in the order they're stored. So a single mesh with see-through parts facing different ways looks right from one side and wrong from the other.

Three colored glass panes, first as three meshes, then merged into one. Orbit around to the other side: the three meshes are re-sorted and stay right, while the merged mesh keeps drawing its panes in stored order, and from the back the front pane is drawn first and hides the others.

<div data-scene="panes"></div>

### Depth writes stay on

Many engines stop transparent objects from writing depth. three.js doesn't: `depthWrite` stays `true` until you turn it off. A see-through object drawn first then writes its depth, and everything behind it that comes later fails the depth test and vanishes, as if the glass were solid.

A glass case holds a glass bottle. Their centers are the same, so neither is behind the other by three.js's measure, and the case, created first, is drawn first. With `depthWrite` on, the case hides the bottle.

<div data-scene="glassCase"></div>

## B · Working knowledge

### Making something see-through

```js
const glass = new MeshStandardMaterial({ color: 'white', transparent: true, opacity: 0.3 });
glass.depthWrite = false; // for glass, overlapping panes, particles
```

- **`opacity` does nothing on its own.** Without `transparent: true`, three.js builds the shader to force full opacity. The same goes for the see-through parts of a PNG texture; for hard-edged cutouts, `alphaTest` is the alternative (the depth buffer and early-z page).
- **`depthWrite: false`** stops see-through objects hiding each other. The price: where two overlap in the wrong order, the colors mix a little wrong, but nothing vanishes.
- **Split large transparent objects into separate meshes** so each one is sorted, or set `renderOrder` when you know the right order.
- A transparent material with `side: DoubleSide` is drawn twice, back faces first and then front faces, so its own two sides blend in the right order: two draw calls.

### Fades

```js
part.material.transparent = true;
part.material.needsUpdate = true; // the shader was built opaque: rebuild it
part.material.opacity = fade;     // 1 → 0 over the fade
```

Switching `transparent` on after the material has been drawn needs `needsUpdate = true`, or the old shader keeps forcing full opacity and nothing fades. Switch it off again once the part is fully visible, so it goes back to the cheaper opaque list.

### Overlays

A highlight or marker drawn over the scene: `transparent: true` for soft edges, `depthTest: false` so nothing hides it, and a high `renderOrder` so it's drawn last in the transparent list.

### What it costs

Every see-through layer is shaded and blended wherever it covers the screen, and the objects behind it are still drawn in full: GPU work for every pixel, layer after layer. A few large panes of glass are cheap; hundreds of overlapping smoke sprites filling the screen are not. The overdraw reduction page in the optimization domain covers cutting it down.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
