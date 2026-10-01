---
id: 3.math.projection-rejection.break-and-fix.1
loop: 3
tier: core
concepts: [math.projection-rejection, math.reflection]
mode: break-and-fix
context: math.projection-rejection/wall-slide
lenses: [space]
misconceptions:
  - math.reflection/n-unnormalized
---

# Reflection: a bounce that gains speed

> **The job:** get both the slide and bounce directions at a slanted wall.

## Task

`slideAndBounce(incoming, normal)` returns the part of movement along the wall and the reflected movement. Both inputs are world-space directions. The wall's normal can have any nonzero length. The starter's slide looks right, but its bounce changes speed when the wall normal is long. Fix it without changing the inputs.

Turn the wall with the slider. The blue bounce arrow should keep the orange incoming arrow's length.

<div data-scene="wall"></div>

## Spaces

| Value | Space |
| --- | --- |
| `incoming`, `normal`, `slide`, `bounce` | World-space directions |

## Your code

Fix `drills/3/math/projection-rejection/break-fix-1/drill.ts`. Name the cause in `cause.md`; write a regression assertion in `check.ts`.

```
npm run drill -- drills/3/math/projection-rejection/break-fix-1
```

## The check

The acceptance test uses long and short slanted normals, checks that slide lies in the wall and bounce preserves movement length, and checks unchanged inputs. Your check must reject the original code.

<details><summary>Hint</summary>

`projectOnPlane` handles a normal of any length. `reflect` expects a unit normal. The same normalized copy can serve both.

</details>

## Where else?

Where else is a direction's length irrelevant to the surface it describes?

<details><summary>A few answers</summary>

A mirror camera, a specular light direction, or an object sliding along a floor.

</details>
