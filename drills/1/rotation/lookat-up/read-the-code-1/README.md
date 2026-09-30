---
id: 1.rotation.lookat-up.read-the-code.1
loop: 1
tier: core
concepts: [rotation.lookat-up]
mode: read-the-code
context: rotation.lookat-up/top-down-camera
lenses: []
misconceptions:
  - rotation.lookat-up/same-facing
  - rotation.lookat-up/spotlight-lookat
---

# lookAt and the up vector

> **In short:** Turns an object in place to face a point, with `up` settling which way its top points.
>
> **Used for:** Signs that face the viewer, aiming turrets and heads, top-down map cameras, and aiming spotlights.

## A · The basics

### Facing a point

```js
turret.lookAt(ball.position); // a point in the world
camera.lookAt(0, 1, 0);       // or x, y, z
```

`lookAt` turns an object where it stands so that it faces a point in the world; it doesn't move it. For a part inside a group, pass `part.getWorldPosition(v)`. Most objects turn their +Z toward the point. Cameras look down their −Z, so they turn their −Z toward it, and `lookAt` treats lights the same way.

Move the ball. The blue arrows show each one's +Z: the turret's points at the ball, and the camera's points away.

<div data-scene="facing"></div>

### What up is for

Facing a point doesn't settle the whole turn: the object could still roll around that line. `object.up`, (0, 1, 0) unless you change it, settles the roll, because `lookAt` keeps the object's own +Y as close to `up` as it can.

When the object looks straight along `up`, there's no roll to pick. three.js doesn't crash; it nudges the direction slightly, and the object can flip 180° as the point passes underneath.

**Analogy: a phone camera.** Pointing it tells it where to aim, not which edge is up. "Keep the top edge toward the sky" settles that, until you aim straight up.

The camera hangs over a floor plan, and the picture in the corner is what it sees. Slide the ball under it: with `up` = (0, 1, 0), the picture flips as the ball passes beneath. With (0, 0, −1), the plan stays upright.

<div data-scene="upHint"></div>

## B · Working knowledge

### Models that face the wrong way

A model built facing −Z ends up with its back to the target. Turn it once inside a holder group, and aim the holder:

```js
holder.add(car);
car.rotation.y = Math.PI;       // once: the car's front now faces the holder's +Z
holder.lookAt(garage.position);
```

### Billboards

A **billboard** is a flat sign that always faces the viewer. Call `sign.lookAt(camera.position)` every frame the camera moves. It turns the sign's +Z toward the camera, which is the side `PlaneGeometry` faces.

### A top-down camera

```js
camera.position.set(0, 20, 0);
camera.up.set(0, 0, -1); // the top of the picture points to −Z, "north" on the plan
camera.lookAt(0, 0, 0);
```

`up` is only read inside `lookAt`, so set it first. Set it before creating `OrbitControls` too, since they read it once.

### Aiming a spotlight

Spot and directional lights shine at their `.target`, whatever their own rotation. `spot.lookAt(point)` turns the light object, but it still shines at its target, which starts at (0, 0, 0). Move the target instead, and add it to the scene so its position stays current:

```js
spot.target.position.copy(product.position);
scene.add(spot, spot.target);
```

Try both buttons, then move the ball. With `lookAt`, the housing turns toward the ball, but the pool of light stays under the lamp.

<div data-scene="spot"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
