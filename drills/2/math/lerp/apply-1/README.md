---
id: 2.math.lerp.apply.1
loop: 2
tier: light
concepts: [math.lerp, math.spherical-coords]
mode: apply
context: math.spherical-coords/lat-long
lenses: [space]
misconceptions:
  - math.lerp/stays-unit
  - math.spherical-coords/phi-from-equator
---

# Lerp and spherical coordinates: a flight across a globe

> **The job:** move a marker between two places on a globe so it stays on the surface the whole way.

## Task

A globe on a sales dashboard shows a delivery flying between two cities. Write `flightPoint(center, radius, from, to, t)`: where the plane is at fraction `t` of the way, from 0 at `from` to 1 at `to`.

`from` and `to` are cities as `{ lat, lon }`, in degrees:

- `lat`, latitude, is how far north of the equator: 90 is the north pole, straight up (+Y), and −90 the south pole.
- `lon`, longitude, is how far around: 0 faces +Z and 90 faces +X.

The plane stays on the globe's surface the whole way, and its latitude and longitude each change steadily with `t`. Routes never cross the 180° line. The globe's center is `center`, and its size is `radius`. Don't change `center`, `from`, or `to`.

Pick a route and drag `t`. The yellow trail is `flightPoint` at every step along the way; it should hug the globe from one city to the other.

<div data-scene="globe"></div>

## Spaces

| Value | Space |
| --- | --- |
| `from`, `to` | Angles, measured from the globe's center |
| `center` | The world |
| What you return | The world |

## Your code

Write it in `drills/2/math/lerp/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/lerp/apply-1
```

## The check

It passes when the flight starts at `from` and ends at `to`, stays exactly `radius` from the center all the way, is at the blended latitude and longitude partway along, puts a city on the equator level with the globe's center, works for a globe away from the origin, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

Blend first, then turn the result into a position. The spherical coordinates page says where phi is measured from; latitude is measured from somewhere else.

</details>

## Where else?

Where else would you blend angles instead of positions, and where else is a point measured from a center?

<details>
<summary>A few answers</summary>

An orbit camera gliding from one view of a product to another. Placing hotspots around a round product. A sun that moves across the sky over a day.

</details>
