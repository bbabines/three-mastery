---
id: 1.rotation.slerp.read-the-code.1
loop: 1
tier: light
concepts: [rotation.slerp]
mode: read-the-code
context: rotation.slerp/blending
lenses: []
misconceptions:
  - rotation.slerp/lerp-euler
---

# Slerp

> **In short:** Slerp blends between two turns by a fraction, taking the shortest way round at an even speed, the way lerp blends between two positions.
>
> **Used for:** A camera swinging smoothly from one view to the next, a turret or a character's head turning to face a target, blending two animation poses in a character or a machine, and a dial or a door easing to a preset angle.

## A · The basics

### Blending two turns

The lerp page blended positions and colors with a fraction `t`. **Slerp** (short for spherical linear interpolation) does the same for turns, using quaternions from the quaternions page: `t` = 0 gives the first turn, 1 gives the second, and 0.5 gives the turn halfway between.

```js
ship.quaternion.slerpQuaternions(start, end, t); // start and end are Quaternions
ship.quaternion.slerp(end, t);                   // from wherever it is now, t of the way to end
```

Two things make it the right tool:

- **An even speed.** Equal steps in `t` turn equal amounts: `t` = 0.25 turns exactly a quarter of the way.
- **The short way round.** Between any two turns there's a short way and a long way. Slerp always takes the short one; since q and −q are the same turn, it picks whichever of the two is closer.

**Analogy: a clock hand.** To get from 11 to 1, the hand should sweep forward past 12, a sixth of the way round. Blending the numbers 11 and 1 would send it backward through 10, 9, and 6 instead: the long way.

### Why not blend the angles?

Blending the three Euler angles one at a time looks like it should work, and it's a very common first try. It doesn't: each angle travels on its own, so the turn curves and wobbles, speeds up and slows down, and can go the long way round. From a heading of 150° to −150°, the numbers pass through 0°, a swing of 300° when the short way is 60°.

The gray ghost is the start and the blue ghost is the end. Drag `t` with each button: the line traces where the ship's nose goes. Slerp takes the short arc, and the turn so far grows evenly. Blending the angles takes a long detour.

<div data-scene="blend"></div>

<details>
<summary>The math, if you're curious</summary>

Quaternions of length 1 sit on a sphere in four dimensions, and the shortest path between two points on a sphere is a **great circle**, like a flight route on a globe. Slerp moves along it at a steady pace. When the two turns are almost the same, three.js blends the four numbers directly and scales the result back to length 1, called **nlerp** (normalized lerp), which is nearly identical and avoids dividing by a tiny number.

</details>

## B · Working knowledge

### Easing toward a goal every frame

```js
turret.quaternion.slerp(goal, 0.1); // a tenth of the remaining turn, every frame
```

It moves fast at first and slows as it arrives, like `position.lerp(target, 0.1)` on the lerp page, and it runs faster on a 120 Hz screen than on a 60 Hz one. For a steady turning speed that stops exactly on the goal:

```js
turret.quaternion.rotateTowards(goal, speed * delta); // at most `speed` radians a second, never past goal
```

### Turning to face a target

Work out the goal first, then turn toward it over the next frames. `lookAt`, which the lookAt page covers, does the working out:

```js
const start = turret.quaternion.clone();
turret.lookAt(target.position); // work out the facing turn, measured from the turret's parent
goal.copy(turret.quaternion);
turret.quaternion.copy(start);  // put it back, then slerp or rotateTowards toward goal
```

### Camera transitions

```js
camera.quaternion.slerpQuaternions(fromView, toView, MathUtils.smoothstep(t, 0, 1));
camera.position.lerpVectors(fromSpot, toSpot, MathUtils.smoothstep(t, 0, 1));
```

`t` runs from 0 to 1 over the move. Slerp itself doesn't ease; `smoothstep` bends `t` so the move starts and ends gently. One catch: `OrbitControls` calls `camera.lookAt(controls.target)` on every update, so it undoes any turn you give the camera. With orbit controls, animate `controls.target` and `camera.position` instead.

### Blending orientations

three.js's animation system blends turns this way too. Between two keyframes of a turn, and when it mixes two animations by weight, it slerps quaternions, never angles. Blending your own poses, like a machine arm halfway between "folded" and "reaching", works the same way: store each pose's turns as quaternions and slerp between them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
