---
id: vfx.integration-forces.page
elective: vfx
kind: page
concepts: [vfx.integration-forces]
renderer: webgpu
---

# Integration and forces

> **In short:** Semi-implicit Euler first changes velocity from forces, then moves the particle using that new velocity.
>
> **Used for:** Falling sparks, wind-blown dust, and orbiting motes.

## A · The basics

Push a rolling ball and it changes speed before it finishes the next stretch of travel. A particle step follows the same order: acceleration changes velocity, drag slows it, then the new velocity changes position. The blue mote below repeats that step under gravity; drag changes how far it travels.

<div data-scene="preview"></div>

## B · Going deeper

### The code you type

```js
const nextVelocity = velocity.clone()
  .addScaledVector(acceleration, dt)
  .multiplyScalar(Math.exp(-drag * dt));
const nextPosition = position.clone().addScaledVector(nextVelocity, dt);
```

| Code or TSL | GLSL | Unreal / Niagara | Purpose |
| --- | --- | --- | --- |
| `addScaledVector(a,dt)` | `v += a * dt` | Acceleration Force | Advances velocity. |
| `exp(-drag*dt)` | `exp` | Drag | Damps speed consistently across step sizes. |
| `p += nextV*dt` | vector addition | Solve Forces | Moves with the updated velocity. |

These state updates can run on a CPU or in GPU particle storage; TSL then uses the positions for rendering. Large or irregular `dt` values reduce integration accuracy, so a production simulation can use fixed small steps. Exponential drag avoids changing behavior just because the frame rate changes.

**Common mistake:** moving with the old velocity, then applying gravity. That is a different integration order and can visibly drift.

## Exercise · Build it

Write `stepParticle` in `drill.ts`. Return new vectors after acceleration, exponential drag, and movement by the new velocity; do not mutate inputs. Run `npm run drill -- electives/vfx/integration-forces`.
