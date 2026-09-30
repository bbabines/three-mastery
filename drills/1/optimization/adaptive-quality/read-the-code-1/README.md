---
id: 1.optimization.adaptive-quality.read-the-code.1
loop: 1
tier: light
concepts: [optimization.adaptive-quality]
mode: read-the-code
context: optimization.adaptive-quality/heavy-scenes
lenses: []
misconceptions:
  - optimization.adaptive-quality/detect-once
---

# Adaptive quality

> **In short:** Instead of guessing a device's speed once, keep checking the frames and trade sharpness for speed only when they run late.
>
> **Used for:** Low-end laptops, heavy views like a whole factory floor, phones that slow as they heat up, and kiosk screens.

## A · The basics

### Measure, don't guess

Checking the device once at startup, by its name or screen size, misses everything that happens later. A phone slows its own chips once it's hot, which is called **thermal throttling**. A laptop may run slower on battery, and one view of a scene can be far heavier than another. Adaptive quality watches the frame times themselves and responds as they change.

The first setting to lower is the pixel ratio: it changes pixel work a lot and is cheap to change back. Shadows and post effects come next.

### Two thresholds, not one

With a single threshold, a scene near the edge flips: a late frame lowers the ratio, the next frame is on time so the ratio goes back up, and the picture pulses. **Hysteresis** is a gap between the two: step down quickly after a run of late frames, but step up only after a much longer run on time.

**Analogy: a thermostat.** It doesn't switch the heating on at 20° and off at 20.1°, clicking every few seconds. It switches on at 19° and off at 21°.

Raise the load and compare the two controllers. The frame times are simulated, but the pixel ratio really changes, so you can see the picture soften.

<div data-scene="controller"></div>

## B · Working knowledge

### A controller with hysteresis

```js
slowFrames = frameMs > budget * 1.25 ? slowFrames + 1 : 0; // frameMs: time between frames
goodFrames = frameMs < budget * 1.05 ? goodFrames + 1 : 0;
if (slowFrames > 30) lower();   // quick to step down
if (goodFrames > wait) raise(); // slow to step back up
```

Frames can't show spare time: on a 60 Hz screen a frame never arrives in under 16.7 ms, however light it is. So stepping up is a guess. If frames run late again after it, step back down and double `wait` before the next try.

Change a setting only when the controller steps, never every frame: `setPixelRatio` resizes the canvas's buffers, and turning shadows on or off rebuilds shaders.

### Timing the right thing

Measure the time between frames, from a `Timer`, not `render()` alone. `render()` returns before the GPU has drawn anything, and late frames are what the user sees.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
