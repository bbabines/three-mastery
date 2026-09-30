---
id: 1.interaction.frame-rate-independence.read-the-code.1
loop: 1
tier: core
concepts: [interaction.frame-rate-independence]
mode: read-the-code
context: interaction.frame-rate-independence/camera-smoothing
lenses: []
misconceptions:
  - interaction.frame-rate-independence/lerp-per-frame
---

# Frame-rate-independent motion

> **In short:** Scale every per-frame change by the frame's length, so motion looks the same on slow and fast screens.
>
> **Used for:** Camera glides, hover growth, smooth drag trailing, and steady turntables.

## A · The basics

### Frames aren't all the same length

The browser redraws as often as the screen refreshes: 60 times a second on many screens, 120 or 144 on others, and less when the computer is busy. `renderer.setAnimationLoop` calls your code once per redraw, a **frame**, so code that moves something a fixed amount per frame moves twice as fast on a 120 Hz screen.

The fix is to think per second and multiply by **delta**, the seconds since the last frame.

**Analogy: a treadmill's speed setting.** Five kilometers an hour is the same pace with quick short steps or slow long ones. "One step per beat" speeds up when the beat does.

Try both buttons: the two balls run the same line, one at 60 frames a second and one at 120.

<div data-scene="steady"></div>

### Easing toward a goal

The lerp page's easing line, `x = lerp(x, target, 0.1)`, closes a tenth of the gap every frame, so at 120 Hz it closes in twice as fast. `MathUtils.damp(x, target, lambda, delta)` works out the fraction from the frame's length instead, so the gap closes at the same rate per second anywhere. A bigger `lambda` is snappier.

<details>
<summary>The math, if you're curious</summary>

`damp` blends by 1 − e^(−λ·dt) each frame, which is **exponential decay**: every second, the gap shrinks to e^(−λ) of what it was, however that second is cut into frames.

</details>

Try both buttons, and compare how far each ball has come a quarter of a second after the target jumps.

<div data-scene="damping"></div>

## B · Working knowledge

### Steady speed with a Timer

```js
const timer = new Timer();
timer.connect(document);                     // no giant delta after the tab was hidden
const delta = timer.update(time).getDelta(); // each frame: seconds since the last one
turntable.rotation.y += 0.5 * delta;         // half a radian a second
```

`time` is what `setAnimationLoop` passes its callback. Browsers stop calling the loop while the tab is hidden, so without `connect` the first frame back has a delta as long as the tab was away. `Clock` is deprecated and warns, so use `Timer`.

### Easing with damp

```js
x = MathUtils.damp(x, target, 8, delta);                                          // a number
camera.position.lerp(goal, 1 - Math.exp(-8 * delta));                             // a vector
part.scale.setScalar(MathUtils.damp(part.scale.x, hovered ? 1.1 : 1, 12, delta)); // hover scale
```

`lambda` is a rate per second, not a fraction, so `damp(x, target, 0.1, delta)` crawls. `lerp(x, target, 10 * delta)` nearly works, but on a slow frame its fraction passes 1 and it overshoots. Turns use the same fraction with `slerp`.

### OrbitControls' damping counts frames

`enableDamping` keeps the same share of the leftover motion at every `update()`, like `lerp(x, target, 0.1)`, so on a 120 Hz screen the glide ends in about half the time. `autoRotate` is the exception: `controls.update(delta)` spins at the same speed everywhere.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
