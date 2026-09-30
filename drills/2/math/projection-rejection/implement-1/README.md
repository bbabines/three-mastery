---
id: 2.math.projection-rejection.implement.1
loop: 2
tier: core
concepts: [math.projection-rejection]
mode: implement
context: math.projection-rejection/axis-constraint
lenses: []
misconceptions:
  - math.projection-rejection/zero-an-axis
---

# Projection: drag along a rail

> **The job:** keep a dragged part on its rail by keeping only the part of the drag that runs along it.

## Task

A shelf bracket slides on a rail that runs at an angle across the floor. When you drag it, it may only move along the rail. Write `alongRail(drag, rail)`, which returns the part of the drag that runs along the rail.

- `drag` is the move the pointer has made since the drag started.
- `rail` is the way the rail runs, at any length.

The bracket's new position is its starting position plus what you return. Don't change `drag` or `rail`.

Drag the pointer with the sliders. The grey ball is where the pointer is; the bracket should stay on the rail, as close to the pointer as the rail allows.

<div data-scene="rail"></div>

## Your code

Write it in `drills/2/math/projection-rejection/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/projection-rejection/implement-1
```

## The check

It passes when the answer runs along the rail, what's left of the drag is at right angles to the rail, it works on rails at an angle and rails that climb, the rail's length makes no difference, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

The projection page shows the rail case in one line. Zeroing an axis only works when the rail lines up with one.

</details>

## Where else?

Where else would you keep only the part of a move that runs along one direction?

<details>
<summary>A few answers</summary>

A gizmo's single-axis arrow. A slider handle in a 3D interface. How far a character has moved along a corridor.

</details>
