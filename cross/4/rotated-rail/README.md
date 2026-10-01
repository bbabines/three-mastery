---
id: 4.math.projection-rejection.cross.1
loop: 4
tier: core
concepts: [math.projection-rejection, transforms.local-vs-world, interaction.axis-drag]
mode: cross-domain
context: math.projection-rejection/axis-constraint
lenses: [space]
misconceptions: []
---

# Slide a part along a rotated rail

> **The job:** Keep a dragged part moving along its rail after the rail turns.

## Task

A rail's own +X direction is its slide axis, but the pointer's `motion` is in world space. Write `railMotion(motion, rail)` to keep only motion along that axis after the rail and its parents turn. Update world matrices before reading the axis. Do not change `motion`.

<div data-scene="rail"></div>

## Spaces

| Value | Space |
| --- | --- |
| `motion` | World direction |
| Rail's +X axis | Local direction, converted to world |
| Return value | World direction |

## Your code

Write it in `cross/4/rotated-rail/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/rotated-rail
```

## The check

The check turns a parent and the rail, then compares the answer with a world-space rail axis and checks that the leftover motion is perpendicular.

<details><summary>Hint</summary>

The pointer motion is in world space; the rail axis starts in local space. Compare them only after they use the same space.

</details>

## Where else?

Where else must a local axis guide world-space motion?

<details><summary>A few answers</summary>

A tilted drawer slide, a hinge handle, or an angled crane guide.

</details>
