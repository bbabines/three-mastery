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

> **In short:** A see-through surface mixes with whatever is already drawn behind it, and three.js orders them object by object, never triangle by triangle.
>
> **Used for:** Glass panels and display cases, fading parts in and out, highlight overlays, and smoke and decals.

## A · The basics

### Mixing with what's already there

For a solid surface, each fragment that passes the depth test replaces the pixel's color. For a see-through one, **blending** mixes the two: with `opacity: 0.3`, the result is 30% the glass and 70% whatever the pixel already held. So anything drawn behind the glass *after* the glass can't show through it. That's why three.js draws solid objects first, then see-through ones back to front. A material only counts as see-through with `transparent: true`.

**Analogy: a watercolor glaze.** A glaze is a thin wash that tints whatever is already painted under it. Paint the sky after the glaze, and the sky simply covers it.

### Sorted per object, not per triangle

three.js sorts see-through objects by each one's center, every frame. Inside one mesh there's no sorting: one draw call draws its triangles in the order they're stored. So one mesh with see-through parts facing different ways looks right from one side and wrong from the other.

Try each button, and orbit around to the back. The three meshes are sorted again and stay right; the merged mesh doesn't.

<div data-scene="panes"></div>

### Depth writes stay on

three.js leaves `depthWrite` on for see-through materials until you turn it off. A see-through object drawn first then writes its depth, and anything behind it that comes later fails the depth test and vanishes.

The glass case and the bottle share a center, and the case is drawn first. Try both buttons.

<div data-scene="glassCase"></div>

## B · Working knowledge

### Making something see-through

```js
const glass = new MeshStandardMaterial({ color: 'white', transparent: true, opacity: 0.3 });
glass.depthWrite = false; // for glass, overlapping panes, particles
```

`opacity` does nothing without `transparent: true`, since the shader is built to force full opacity. With `depthWrite: false`, see-through objects stop hiding each other: where two overlap in the wrong order the colors mix a little wrong, but nothing vanishes. Split large see-through objects into separate meshes so each one is sorted.

### Fading a part

```js
part.material.transparent = true;
part.material.needsUpdate = true; // the shader was built opaque: rebuild it
part.material.opacity = fade;     // 1 → 0 over the fade
```

Switch `transparent` off again once the part is fully visible, so it goes back to the cheaper solid list.

### Overlays and smoke

A highlight drawn over the scene uses `transparent: true` for soft edges, `depthTest: false` so nothing hides it, and a high `renderOrder` so it's drawn last. Every see-through layer is shaded and blended wherever it covers, and what's behind it is still drawn in full. A few panes of glass are cheap, but hundreds of overlapping smoke sprites filling the screen cost GPU work for every pixel, layer after layer.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
