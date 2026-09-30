---
id: 1.interaction.interpolation-toolbox.read-the-code.1
loop: 1
tier: light
concepts: [interaction.interpolation-toolbox]
mode: read-the-code
context: interaction.interpolation-toolbox/ui-transitions
lenses: []
misconceptions:
  - interaction.interpolation-toolbox/linear-natural
---

# Interpolation toolbox

> **In short:** A handful of small functions shape a blend's `t`, so values ease in and out, stay in range, and map between ranges.
>
> **Used for:** Fading menus, gentle camera moves, turning a drag into a dial value, and dimming lights with distance.

## A · The basics

### Shaping t

Most animation is a lerp with `t` running from 0 to 1 over time. Fed straight from the clock, the value moves at one speed the whole way: full speed from the first frame, then a dead stop. That's **linear**, and it looks mechanical.

An **easing curve** bends `t` first. `MathUtils.smoothstep(t, 0, 1)` still runs from 0 to 1, but it starts slowly, speeds up through the middle, and slows into the end.

**Analogy: a car between two traffic lights.** It pulls away gently and brakes before the line. Linear is flooring it from a standstill and stopping dead at the line.

Try each curve: the ghosts mark equal steps of time, so bunched ghosts mean slow. Drag `t` to move the ball.

<div data-scene="ease"></div>

## B · Working knowledge

### clamp: keep t in range

```js
const t = MathUtils.clamp(elapsed / duration, 0, 1);
```

Past 1, a lerp keeps going and overshoots, so clamp `t` before easing or blending with it.

### smoothstep and smootherstep

```js
const eased = MathUtils.smoothstep(t, 0, 1);                 // gentle start and stop
const softer = MathUtils.smootherstep(t, 0, 1);              // gentler still at both ends
camera.quaternion.slerpQuaternions(fromView, toView, eased); // turns take an eased t too
```

The value comes first, then the range. GLSL's `smoothstep(edge0, edge1, x)` puts the value last, and copying that order gives 0 for every `t` from 0 to 1. The range can be any window: `MathUtils.smoothstep(distance, 2, 5)` fades from 0 at 2 units to 1 at 5.

### mapLinear: from one range to another

```js
const angle = MathUtils.mapLinear(dragPixels, 0, 200, 0, Math.PI); // 0–200 px of drag → 0–180°
```

It doesn't clamp, so a 300-pixel drag gives 270°. `MathUtils.inverseLerp(a, b, v)` is its first half: where `v` sits between `a` and `b`, from 0 to 1.

### Other easing curves

The core has no ease-in, ease-out, or bounce curves, but the short ones are a line each: `1 - (1 - t) ** 3` eases out (quick start, gentle stop) and `t ** 3` eases in. Easing out suits things that answer the user, because the motion starts right away.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
