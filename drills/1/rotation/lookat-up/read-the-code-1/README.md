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

> **In short:** `object.lookAt(point)` turns an object to face a point in the world, using its `up` direction to decide which way is up; cameras turn their −Z toward the point, most other objects their +Z, and spot and directional lights ignore it and shine at their `.target`.
>
> **Used for:** Signs and labels that always face the viewer, pointing a turret, a security camera, or a character's head at something, a map camera looking straight down on a floor plan, and aiming spotlights at products in a showroom.

## A · The basics

### Facing a point

```js
turret.lookAt(ball.position); // a point in the world
camera.lookAt(0, 1, 0);       // or x, y, z
```

`lookAt` turns an object where it stands so that it faces the point; it doesn't move it. The point is in the world, which is why a part inside a group needs `getWorldPosition`, as on the local vs world space page.

Which side ends up facing the point depends on what the object is:

- **Most objects**, like meshes, groups, and loaded models, turn their +Z toward the point. That's why the cones and ships on these pages point their tips along +Z.
- **Cameras** look down their −Z, so `lookAt` turns their −Z toward the point. It treats lights the same way.

The same call, opposite axes. The blue arrows show each one's +Z: the turret's points at the ball, and the camera's points away from it.

<div data-scene="facing"></div>

### What up is for

Knowing which way to face doesn't settle the whole turn: the object could still roll around that line to any angle. `up` settles it. Every object has `object.up`, (0, 1, 0) unless you change it, and `lookAt` keeps the object's own +Y as close to it as it can. Inside, it builds the object's axes with cross products, as on the rotation basis page: its side from up and forward, then its real up from forward and side.

When forward lines up with `up`, looking straight up or straight down, the cross product page showed the result is (0, 0, 0): there's no side to build from. three.js doesn't crash. It nudges the direction by 0.0001 and carries on, but the roll is then decided by that nudge, not by you, and the object flips 180° as the point passes straight underneath.

**Analogy: a phone camera.** Pointing your phone at something tells it where to aim, not whether you're holding it upright, sideways, or upside down. "Keep the top edge toward the sky" settles that; that's the up vector. Aim straight up at the ceiling, and "toward the sky" no longer tells you which way to hold it.

The camera hangs over a floor plan and looks at the orange ball, and the picture in the corner is what it sees. Slide the ball under the camera: with `up` = (0, 1, 0), the picture flips over as the ball passes beneath. With `up` = (0, 0, −1), the top of the picture stays toward the plan's north arrow.

<div data-scene="upHint"></div>

## B · Working knowledge

### Aiming at a part

```js
turret.lookAt(part.getWorldPosition(spot)); // part.position is wrong if the part is inside a group
```

`lookAt` refreshes the matrices it needs first, and it allows for a turned parent: an object inside a turned group still ends up facing the point. The one thing it doesn't support, as three.js's docs say, is a parent stretched by different amounts on each axis.

### Models that face the wrong way

A model built with its front along −Z ends up with its back to the target. Turn it once inside a holder group, so its front lines up with the holder's +Z, and aim the holder:

```js
const holder = new Group();
holder.add(car);
car.rotation.y = Math.PI;       // once: the car's front now lines up with holder's +Z
holder.lookAt(garage.position); // the front faces the garage
```

### Billboards

A **billboard** is a flat sign that always faces the viewer. Two common ways, each run every frame the camera moves:

```js
sign.lookAt(camera.position);            // turns toward the camera's position
sign.quaternion.copy(camera.quaternion); // lies flat to the screen, facing the camera
```

The first makes each sign face the point where the camera is, so signs near the edges of the view turn in toward it. The second makes every sign parallel to the screen, the way a three.js `Sprite` always draws. Both need the sign's front on +Z, which is how `PlaneGeometry` is built.

### A top-down camera

```js
camera.position.set(0, 20, 0);
camera.up.set(0, 0, -1); // the top of the picture points to −Z: "north" on the plan
camera.lookAt(0, 0, 0);
```

- **Set `up` before `lookAt`.** `up` is only read inside `lookAt`, so changing it afterward does nothing until the next `lookAt`.
- **Set it before making `OrbitControls` too.** The controls read `camera.up` once, when they're created, and orbit around it.
- `OrbitControls` also stops a hair short of looking straight down, as the gimbal lock page mentioned, so it never lands exactly on the spot where up and forward line up.

### Aiming a spotlight

```js
spot.position.set(0, 4, 0);
spot.target.position.set(2, 0, -1);
scene.add(spot, spot.target); // the target must be in the scene to stay current
```

- **Spot and directional lights shine at their `.target`, whatever their own rotation.** `spot.lookAt(point)` turns the light object, and anything attached to it, but the light still shines at its target, which starts at (0, 0, 0). A `DirectionalLight` works the same way: it shines along the line from its position to its target.
- **Add the target to the scene.** It's an ordinary Object3D. If it isn't in the scene, its world position never refreshes, and moving it does nothing; the update timing page covers why.
- **To follow an object**, make it the target: `spot.target = product;` The light tracks the product as it moves.
- **Helpers can hide the problem.** `SpotLightHelper` and `DirectionalLightHelper` refresh the target themselves when you call their `update()`, so a light that looks right with its helper can shine at the wrong spot once the helper is removed.

Try both buttons, then move the ball. With `lookAt`, the light's housing turns toward the ball, but the pool of light stays under the lamp.

<div data-scene="spot"></div>

### Which space is it in?

| Value | Space |
| --- | --- |
| The point passed to `lookAt` | The world |
| `object.up` | A direction in the world |
| The turn `lookAt` sets | Written into `quaternion`, measured from its parent |
| `spot.target.position` | Measured from the target's parent: the scene, once it's added |
| Where a spot or directional light shines | Toward the target's position in the world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
