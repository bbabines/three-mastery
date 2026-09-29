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

> **In short:** Anything that moves a little every frame has to be scaled by how long that frame took, so it moves the same on a 60 Hz and a 120 Hz screen; for easing toward a goal, that means `MathUtils.damp` instead of a fixed `lerp` fraction.
>
> **Used for:** A camera that glides to a stop; a part that grows a little while it's hovered; an object that trails the pointer smoothly while dragged; and a turntable that spins at a steady speed.

## A · The basics

### Frames aren't all the same length

The browser redraws as often as the screen refreshes: 60 times a second on many screens, 120 or 144 on others, and less when the computer is busy. `renderer.setAnimationLoop` calls your code once per redraw, each a **frame**. Code that moves something a fixed amount per frame moves twice as fast on a 120 Hz screen.

The fix is to think per second and multiply by **delta**, the seconds since the last frame. A speed of 0.72 units a second times delta covers the same ground at any frame rate: small steps often, or bigger steps less often.

**Analogy: a treadmill's speed setting.** Five kilometers an hour is the same pace with quick short steps or slow long ones. "One step per beat" speeds up when the beat does.

The two balls run the same line of code, one at 60 frames a second and one at 120. The page steps each with fixed frame lengths, whatever your screen does.

<div data-scene="steady"></div>

### Easing toward a goal

The lerp page's easing line, `x = lerp(x, target, 0.1)`, closes a tenth of the gap every frame. At 120 Hz that's twice as many tenths a second, so it closes in on the goal twice as fast. `MathUtils.damp(x, target, lambda, delta)` works out the fraction for the frame's length instead, so the gap closes at the same rate per second at any frame rate. `lambda` sets how quickly: bigger is snappier.

<details>
<summary>The math, if you're curious</summary>

`damp` blends by 1 − e^(−λ·dt) each frame, which is **exponential decay**, also called exponential smoothing: every second, the gap shrinks to e^(−λ) of what it was, however that second is cut into frames. Half the gap closes in about 0.69 ÷ λ seconds.

</details>

The target jumps back and forth. Compare how far each ball has come a quarter of a second after each jump.

<div data-scene="damping"></div>

## B · Working knowledge

### Steady speed with a Timer

```js
const timer = new Timer();
timer.connect(document); // no giant delta after the tab was hidden
renderer.setAnimationLoop((time) => {
  timer.update(time);
  const delta = timer.getDelta();      // seconds since the last frame
  turntable.rotation.y += 0.5 * delta; // half a radian a second
  renderer.render(scene, camera);
});
```

- **Use `THREE.Timer`.** `THREE.Clock` is deprecated since r183 and warns when you create one.
- **Connect it to the document.** Browsers stop calling the loop while the tab is hidden. Without `connect`, the first frame back has a delta as long as the tab was away, and everything jumps. Connected, the timer starts counting afresh when the page comes back.
- A slow frame from loading or a busy computer still gives a big delta. Capping it, `Math.min(delta, 0.1)`, is a common guard.

### Easing with damp

```js
x = MathUtils.damp(x, target, 8, delta);                                   // a number
camera.position.lerp(goal, 1 - Math.exp(-8 * delta));                      // a vector: Vector3 has no damp
part.scale.setScalar(MathUtils.damp(part.scale.x, hovered ? 1.1 : 1, 12, delta)); // hover scale
```

- **`lambda` is per second, not a fraction.** `damp(x, target, 0.1, delta)` crawls, closing under a tenth of the gap each second.
- `lerp(x, target, 10 * delta)` looks right and nearly is at ordinary frame rates, but not exactly, and on a slow frame, with delta at 0.2, its fraction reaches 2 and it overshoots the target. `damp`'s fraction never passes 1.
- For turns, the same fraction works with slerp: `q.slerp(goal, 1 - Math.exp(-8 * delta))`, as on the slerp page.

### OrbitControls' damping counts frames

`enableDamping` keeps the same share of the leftover motion at every `update()`, per frame, the same easing as `lerp(x, target, 0.1)`. On a 120 Hz screen the glide after the user lets go ends in about half the time. `autoRotate` is the exception: pass the frame's seconds, `controls.update(delta)`, and it spins at the same speed everywhere.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
