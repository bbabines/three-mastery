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

> **In short:** Adaptive quality watches frame times as the app runs, lowers settings like the pixel ratio when frames run late, and raises them again once there's room, with a gap between the two, called hysteresis, so the picture doesn't flip back and forth.
>
> **Used for:** Keeping a configurator smooth on low-end laptops and phones; a heavy view, like a whole factory floor, that's fine up close and slow zoomed out; a phone that slows down as it heats up; and a kiosk or presentation screen whose speed nobody knows in advance.

## A · The basics

### Measure, don't guess

Checking the device once at startup, by its name or its screen size, and picking a quality then, misses everything that happens later. The same phone runs slower once it's hot: it slows its own chips to cool down, which is called **thermal throttling**. A laptop may run slower on battery, and one view of a scene can be far heavier than another. Adaptive quality watches the frame times themselves (the frame budget page) and responds as they change.

The first lever is the pixel ratio (the resolution and DPR page): it changes pixel work a lot, and it's cheap to change back. Shadows and post effects are the next ones.

### Two thresholds, not one

With a single threshold, a scene near the edge flips: a late frame lowers the ratio, the next frame is on time so the ratio goes back up, the frame after is late again, and the picture pulses. **Hysteresis** keeps a gap: step down quickly after a run of late frames, but step up only after a much longer run of frames on time, and wait longer after each step up that doesn't hold.

**Analogy: a thermostat.** It doesn't switch the heating on at 20° and off at 20.1°, clicking every few seconds. It switches on at 19° and off at 21°.

This is a model: the frame times are simulated from the pixel ratio and the load slider, as on a 60 Hz screen, so nothing here measures your machine. The pixel ratio really changes, so you can see the picture soften. Raise the load and compare the two controllers.

<div data-scene="controller"></div>

## B · Working knowledge

### A controller with hysteresis

```js
// frameMs: the time between frames, from a Timer, smoothed over a few frames
slowFrames = frameMs > budget * 1.25 ? slowFrames + 1 : 0;
goodFrames = frameMs < budget * 1.05 ? goodFrames + 1 : 0;
if (slowFrames > 30) lower();         // quick to step down
if (goodFrames > wait) raise();       // slow to step back up
```

- **Measure the time between frames**, not `render()` alone: `render()` returns before the GPU has drawn anything (the measurement tools page). Frames arriving late is what the user sees.
- **Frames can't show spare time.** At 60 Hz a frame never arrives in less than 16.7 ms, however light it is (the frame budget page). So stepping up is a guess: try it after a long run on time, and if frames run late again, step back down and double `wait` before the next try.
- **Change settings between frames, not every frame.** `setPixelRatio` resizes the canvas's buffers, and turning shadows on or off rebuilds shaders.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
