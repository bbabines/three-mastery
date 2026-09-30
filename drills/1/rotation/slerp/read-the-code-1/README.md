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

> **In short:** Blends one turn into another by a fraction, turning at an even speed and always the short way round.
>
> **Used for:** Camera moves between views, turning to face a target, blending animation poses, and doors easing open.

## A · The basics

### Blending two turns

**Slerp** (spherical linear interpolation) does for turns what lerp does for positions, using quaternions. `t` = 0 gives the first turn and 1 gives the second. Slerp turns at an even speed, so 0.25 turns exactly a quarter of the way, and it always takes the short way round.

```js
ship.quaternion.slerpQuaternions(start, end, t);
```

**Analogy: a clock hand.** To get from 11 to 1, the hand sweeps forward past 12. Blending the numbers 11 and 1 would send it backward through 6, the long way.

### Why not blend the angles?

Blending the three Euler angles one at a time is a common first try. Each angle travels on its own, so the turn wobbles and can go the long way: from a heading of 150° to −150°, the numbers pass through 0°, a swing of 300° when the short way is 60°.

Try each button and drag `t`. The orange line traces where the ship's nose goes, from the gray ghost to the blue one.

<div data-scene="blend"></div>

<details>
<summary>The math, if you're curious</summary>

Quaternions of length 1 sit on a sphere in four dimensions, and slerp moves along the shortest path between two of them, a **great circle**, like a flight route on a globe.

</details>

## B · Working knowledge

### Turning to face a target

Let `lookAt` work out the goal, then put the old turn back:

```js
const start = turret.quaternion.clone();
turret.lookAt(target.position);
goal.copy(turret.quaternion);
turret.quaternion.copy(start);
```

Then, each frame, `turret.quaternion.rotateTowards(goal, speed * delta)` turns at a steady speed and stops exactly on the goal. `turret.quaternion.slerp(goal, 0.1)` covers a tenth of what's left instead, so it slows as it arrives.

### Camera moves and poses

```js
camera.quaternion.slerpQuaternions(fromView, toView, MathUtils.smoothstep(t, 0, 1));
camera.position.lerpVectors(fromSpot, toSpot, MathUtils.smoothstep(t, 0, 1));
```

Slerp doesn't ease by itself; `smoothstep` makes the move start and end gently. To blend two poses of a machine arm, store each pose's turns as quaternions and slerp between them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
