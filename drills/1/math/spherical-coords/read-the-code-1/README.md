---
id: 1.math.spherical-coords.read-the-code.1
loop: 1
tier: light
concepts: [math.spherical-coords]
mode: read-the-code
context: math.spherical-coords/orbit-camera
lenses: []
misconceptions:
  - math.spherical-coords/phi-from-equator
  - math.spherical-coords/poles
---

# Spherical coordinates

> **In short:** Describes a point by its distance from a center and two angles, instead of x, y, and z.
>
> **Used for:** Orbit cameras, placing things around a sphere, and latitude and longitude.

## A · The basics

### Another way to say where

So far, a place has been three distances: right, up, and toward you. **Spherical coordinates** describe the same place a different way, from a center point:

- **radius**: how far from the center.
- **phi**: how far down from straight up. 0 is the top, a quarter turn is level with the center, and half a turn is the bottom.
- **theta**: how far around, like turning in a circle.

**Analogy: a camera on a boom arm.** The arm's length is the radius. Tilting the arm down from vertical is phi. Swinging it around the base is theta.

Try each slider. Push phi all the way to 0 and then move theta: nothing changes, because at the very top, "around" has nowhere to go.

<div data-scene="orbit"></div>

```js
const s = new Spherical(radius, phi, theta);
camera.position.setFromSpherical(s);
```

## B · Working knowledge

### This is how orbit cameras work

`OrbitControls` keeps the camera's position around its target as spherical coordinates: dragging changes theta and phi, and zooming changes the radius. You'd use the same idea to write your own orbit or turntable camera.

### Measured from a center

Spherical coordinates are relative to their center. For an orbit camera, that's the target, so add the target's position back:

```js
camera.position.setFromSpherical(s).add(target);
```

Leave that off and the camera orbits the world's origin instead of the target.

### Phi starts at the top

phi is measured down from straight up (+Y), not up from the level line. phi = 0 is directly above the center, looking straight down.

### The poles

At the very top or bottom (phi = 0 or half a turn), theta stops meaning anything, and a camera looking straight down can spin unpredictably. That's why orbit cameras stop just short of the poles: `spherical.makeSafe()` does it, and `OrbitControls` has `minPolarAngle` and `maxPolarAngle` to limit the range.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
