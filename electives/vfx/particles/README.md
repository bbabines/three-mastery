---
id: vfx.particles.page
elective: vfx
kind: page
concepts: [vfx.particles]
renderer: webgpu
---

# Particle fundamentals

> **In short:** An emitter spawns particles at a rate per second, lets each live for a while, and changes it using age divided by lifetime.
>
> **Used for:** Sparks, dust, and short UI bursts.

## A · The basics

Think of a faucet set to eight drops a second. A fast frame cannot make eight drops and a slow frame another eight: the rate belongs to elapsed time. Fractions matter too. If a frame earns 0.4 of a drop, save it so later frames can finish one. The demo uses that carry and removes each mote after its lifetime.

<div data-scene="preview"></div>

## B · Going deeper

### The values and nodes you use

```js
const total = carry + ratePerSecond * dt;
const count = Math.floor(total);
carry = total - count;
const age01 = Math.min(1, ageSeconds / lifetimeSeconds);
```

| Code or TSL | GLSL | Unreal / Niagara | Purpose |
| --- | --- | --- | --- |
| `rate * dt` | CPU spawn control | Spawn Rate | Keeps births tied to seconds. |
| `age / lifetime` | normalized age | Particle Age | Runs color, size, and opacity curves over life. |
| `mix(start,end,age01)` | `mix` | Lerp | Blends an attribute over life. |

The emitter may run on the CPU while TSL shades each particle on the GPU. Keep a small pool of particle geometry and materials rather than allocating a new resource for each birth. Rate times lifetime gives a rough live-particle count; wide transparent particles can hit a pixel-cost limit before the CPU update is slow.

**Common mistake:** adding a fixed number each frame. It doubles the spawn rate when the display refreshes twice as often.

## Exercise · Build it

Write `emit` in `drill.ts`. Return the whole-particle count and fractional carry after one frame. Run `npm run drill -- electives/vfx/particles`; the check uses unequal frame lengths and a carry from the previous call.
