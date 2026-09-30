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

> **In short:** three.js reorders what it draws every frame: solid things first, grouped by material and nearest first, then see-through things farthest first.
>
> **Used for:** Scenes with many materials, labels that must draw last, see-through parts that blend right, and saving pixel work.

## A · The basics

### Why three.js sorts

Everything set up before a draw, like the shader program, the material's values, and blending, is called **state**, and changing it costs CPU time. So before drawing, three.js puts everything in view into three lists, draws them in this order, and sorts each one:

| List | Sorted by |
| --- | --- |
| Solid | `renderOrder`, then material, then front to back |
| Transmission (`transmission` above 0) | `renderOrder`, then back to front |
| See-through (`transparent: true`) | `renderOrder`, then back to front |

Grouping by material keeps state changes down. Front to back lets the depth test skip hidden fragments, and back to front lets each see-through object blend over what's behind it. Distance is measured to each object's center.

**Analogy: a delivery route.** The driver doesn't deliver in the order the orders came in. The van is loaded by neighborhood, and within each one the nearest house comes first.

Orbit around and watch the draw order change. Then turn sorting off, and give D a `renderOrder`.

<div data-scene="order"></div>

## B · Working knowledge

### Forcing an order

```js
label.renderOrder = 999;          // after everything at the default 0, in its list
label.material.depthTest = false; // and drawn over anything nearer
```

`renderOrder` beats distance and material, but only within its list: a solid object at 999 still draws before every see-through one. Drawing last isn't drawing on top, since a later draw still fails the depth test behind a nearer surface. That's what `depthTest: false` is for.

### Turning sorting off

```js
renderer.sortObjects = false; // each list keeps scene order
```

Use it when you control the order yourself, like a 2D overlay. Solid objects still draw before see-through ones.

### Keeping material switches down

Each switch to a different material means sending its values again, and a switch to a different shader program costs more. Sorting keeps the switches down, but each distinct material still costs at least one, so parts that look the same should share a material.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
