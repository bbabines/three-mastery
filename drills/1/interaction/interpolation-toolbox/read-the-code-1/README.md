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

> **In short:** A few small functions shape how a value travels between two ends: `clamp` keeps it in range, `smoothstep` eases its start and finish, `mapLinear` converts one range to another, and `Quaternion.slerp` blends turns; other easing curves come from outside three.js's core.
>
> **Used for:** Fading a menu in and out; a camera move to a part that starts and stops gently; turning the distance of a drag into a dial's value; and dimming a light as a visitor walks away from it.

## A · The basics

### Shaping t

Most animation is a lerp, from the lerp page, with `t` running from 0 to 1 over time. Feed it `t` straight from the clock and the value moves at one speed the whole way: full speed from the first frame, and a dead stop at the end. That's **linear**, and it looks mechanical. An **easing curve** bends `t` first. `MathUtils.smoothstep(t, 0, 1)` still runs from 0 to 1, but it starts slowly, speeds up through the middle, and slows into the end.

**Analogy: a car between two traffic lights.** It pulls away gently and brakes before the line. Linear is flooring it from a standstill and stopping dead at the line.

The ghosts mark where the ball is at equal steps of time. Evenly spaced ghosts mean one speed the whole way; bunched ghosts mean it's moving slowly there. Drag `t` to move the ball itself.

<div data-scene="ease"></div>

## B · Working knowledge

### clamp: keep t in range

```js
const t = MathUtils.clamp(elapsed / duration, 0, 1);
```

Past 1, a lerp keeps going and overshoots, as on the lerp page, so clamp `t` before easing or blending with it.

### smoothstep and smootherstep

```js
const eased = MathUtils.smoothstep(t, 0, 1);    // gentle start and stop
const softer = MathUtils.smootherstep(t, 0, 1); // gentler still at both ends
```

- **The value comes first, then the range:** 0 below `min`, 1 above `max`, and an S-curve between. GLSL's `smoothstep(edge0, edge1, x)` puts the value last, and copying that order into three.js gives 0 for every `t` from 0 to 1.
- The range can be any window: `MathUtils.smoothstep(distance, 2, 5)` fades from 0 at 2 units away to 1 at 5.

### mapLinear: from one range to another

```js
const angle = MathUtils.mapLinear(dragPixels, 0, 200, 0, Math.PI); // 0–200 px of drag → 0–180°
```

- **It doesn't clamp.** A 300-pixel drag gives 270°. Clamp the input or the result.
- `MathUtils.inverseLerp(a, b, v)` is its first half: where `v` sits between `a` and `b`, as a value from 0 to 1.
- Other libraries call this "remap"; three.js has no `MathUtils.remap`.

### Other easing curves

three.js's core has no ease-in, ease-out, or bounce curves. The short ones are a line each: `1 - (1 - t) ** 3` eases out (quick start, gentle stop) and `t ** 3` eases in. three.js ships the tween.js library among its add-ons, `three/addons/libs/tween.module.js`, and animation libraries have full sets. Easing out is a common choice for things that answer the user, because the motion starts right away.

### Turns: slerp with the same t

```js
camera.quaternion.slerpQuaternions(fromView, toView, MathUtils.smoothstep(t, 0, 1));
```

Blend turns with slerp, never by blending angles, as on the slerp page. An eased `t` works the same there as anywhere.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
