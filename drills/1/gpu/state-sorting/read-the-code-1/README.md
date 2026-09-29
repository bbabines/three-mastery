---
id: 1.gpu.state-sorting.read-the-code.1
loop: 1
tier: light
concepts: [gpu.state-sorting]
mode: read-the-code
context: gpu.state-sorting/material-count
lenses: []
misconceptions:
  - gpu.state-sorting/scene-order
---

# State changes and sorting

> **In short:** three.js doesn't draw things in the order you added them: every frame it sorts solid objects to keep same-material draws together and go front to back, and see-through objects to go back to front, and `renderOrder` overrides both.
>
> **Used for:** Keeping a scene with many materials cheap to submit; forcing labels and outlines to draw last; making see-through parts blend over what's behind them; and saving pixel work by drawing near things first.

## A · The basics

### Why three.js sorts

The draw call anatomy page showed that three.js skips any command that matches the last one sent. Everything set up before a draw, the program, the material's settings, blending, the depth test, is called **state**, and changing it is what costs. Two draws in a row with the same material need almost no new state. So before drawing, three.js sorts everything in view into three lists and draws them in this order:

| List | What goes in it | Sorted by |
| --- | --- | --- |
| Opaque | Everything else: `transparent: false` and no transmission | `renderOrder`, then material, then front to back |
| Transmission | Materials with `transmission` above 0 | `renderOrder`, then back to front |
| Transparent | Everything with `transparent: true` | `renderOrder`, then back to front |

"Front to back" is measured from each object's center (the center of its bounding sphere), along the way the camera faces. Opaque objects go front to back so the depth test can throw away fragments hidden behind them before they're shaded, which the depth buffer and early-z page covers. See-through objects go back to front so each one blends over what's already behind it, which the blending page covers.

**Analogy: a delivery driver's route.** Orders come in all day, but the driver doesn't deliver them in that order. The van is loaded by neighborhood, so one stop follows the next without backtracking (grouping by material), and within a neighborhood the nearest house comes first (front to back). `renderOrder` is the customer who paid for a delivery slot: they're served at that slot whatever the route says.

The objects were added to the scene in this order: glass, A, B, C, D. A and C share the red material; B and D share the blue one. The readout lists the order three.js actually drew them last frame. Orbit around to watch the front-to-back order change, then try turning sorting off and giving D a `renderOrder`.

<div data-scene="order"></div>

## B · Working knowledge

### renderOrder

```js
badge.renderOrder = 1;    // after everything at the default 0, in its list
label.renderOrder = 999;
label.material.depthTest = false; // and drawn over anything nearer
```

- **It beats distance and material,** within its list: a farther object with a higher `renderOrder` still draws later.
- **It doesn't cross lists.** An opaque object with `renderOrder = 999` still draws before every transparent one.
- **Drawing last isn't drawing on top.** A later draw still fails the depth test behind a nearer surface. To draw over everything, like the labels on these pages, also set `depthTest: false`.
- **A Group's `renderOrder` sorts everything inside it,** ahead of each object's own: the whole group moves together in the order.

### Turning sorting off

```js
renderer.sortObjects = false; // each list keeps scene order
```

Use it when you control the order yourself, like a 2D overlay drawn in a fixed order. Even then, opaque still draws before transparent. `renderer.setOpaqueSort(fn)` and `setTransparentSort(fn)` replace the sorting rules instead of turning them off.

### Material count

Every switch to a different material makes three.js go through that material's settings and upload the ones that changed; a switch to a different shader program adds the program switch and the camera's and lights' settings. Sorting keeps the switches down, but each distinct material still costs at least one. Parts that look the same should share one material, which the draw call reduction page covers along with the other ways of cutting draw calls.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
