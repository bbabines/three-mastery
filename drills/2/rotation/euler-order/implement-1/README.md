---
id: 2.rotation.euler-order.implement.1
loop: 2
tier: core
concepts: [rotation.euler-order]
mode: implement
context: rotation.euler-order/yaw-pitch-camera
lenses: []
misconceptions:
  - rotation.euler-order/order-irrelevant
  - rotation.euler-order/y-is-yaw
---

# Euler order: a mouse-look camera

> **The job:** turn a first-person camera from a heading and a tilt, with the horizon level however far it tilts.

## Task

In a walk-through of a showroom, dragging the mouse sideways changes the camera's heading, and dragging up and down tilts its view. Write `lookRotation(yaw, pitch)`, which returns the camera's `rotation` as an `Euler`:

- `yaw` is the heading, in radians. At 0 the camera looks down −Z, and a positive yaw turns it to the left, around the upright Y.
- `pitch` is the tilt, in radians, from about −1.5 to 1.5. Positive looks up and negative looks down.
- The horizon stays level: the right edge of the picture, the camera's own +X, never tips up or down.

The camera has no parent, so its turn is measured from the world.

Tilt the view well away from level, then drag `yaw`. The picture in the corner is what the camera sees: the yellow ball should stay in its middle, and the horizon should stay flat.

<div data-scene="look"></div>

## Your code

Write it in `drills/2/rotation/euler-order/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/rotation/euler-order/implement-1
```

## The check

It passes when the camera looks where the heading and tilt say, for headings all the way round and tilts up and down, its own +X stays level every time, and the picture stays the right way up.

<details>
<summary>Hint</summary>

The Euler angles and order page has a camera like this one. Which of the two turns has to happen first for the horizon to stay level?

</details>

## Where else?

Where else does the order of three angles decide how something ends up turned?

<details>
<summary>A few answers</summary>

A turret that swings round and then raises its barrel. A robot arm with one motor per joint. Turns read from a file made in another program.

</details>
