---
id: effects.motion-smoothing.page
elective: effects
kind: page
concepts: [effects.motion-smoothing]
renderer: webgpu
---

# Smoothing while moving

> **In short:** Each frame is drawn from a slightly shifted spot and blended into the last ones, moved along with the picture, so edges stay smooth in motion.
>
> **Used for:** turntables and orbiting viewers, animated products, calming noisy effects while moving, and games.

## What it adds

### Old frames, moved to follow the picture

Averaging shifted frames smooths edges and glints, but only while nothing moves: blend in an old frame after the view turns, and every edge smears. **Smoothing over frames** (TRAA, temporal reprojection anti-aliasing) moves the old frames along first. With each frame, the scene also writes a **motion buffer**: how far every pixel moved since the last frame. TRAA uses it to find where each pixel was, takes the old color from there, and blends the new frame in.

Where the old color can't be trusted, because a part just came into view or the color jumped, it leans on the new frame instead. That keeps trails short, but some softness and faint trails remain.

Think of a photographer panning with a passing car. The camera follows the car, so the car stays sharp while the shutter stays open.

With the view **turning**, compare **TRAA** with **antialias: true**, then pick **6× closer**. Then try **blend, no motion buffer**: the same blending without following the motion, which smears everything. **The motion buffer** shows what TRAA follows: the floor's far edge moves most, and the watch, at the center of the turn, barely moves.

<div data-scene="adds"></div>

## What it costs

### A motion buffer, a blend, and softness

TRAA isn't free. The scene writes the motion buffer as it draws, then a full-size pass blends each new frame into the history, and the history is copied for the next frame. It also softens fine detail a little and can leave faint trails. Multisampling costs extra memory and work in the scene draw instead.

The two don't add up. TRAA's shifted frames already cover the spots inside each pixel that multisampling would check, and three.js can't run TRAA on a multisampled scene pass: WebGPU reports a sample-count mismatch on every frame. `pass()` takes the renderer's `antialias` setting unless told `samples: 0`.

Try each at pixel ratio 1, then at 2, pressing **time it** for each. The readout keeps each setting's time.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once, so a frame of many passes reads several times too long; the budget page shows how far.

## When to use it

The watch's WebGi setup smooths over frames while the camera moves and switches to 32 averaged frames once it stops (the progressive smoothing page). Noisy effects lean on it too: ambient occlusion and bounced light change their sample pattern every frame and count on TRAA to blend it away.

| Use it | Skip it |
| --- | --- |
| Glints and fine texture that crawl while moving | Simple, smooth shapes where multisampling looks fine |
| Effects that change their sample pattern each frame | Fast motion where trails would show |
| Turntables and orbiting views | A plain WebGL viewer, which has no TRAA |

In a plain WebGL viewer, use multisampling (or SMAA) while moving, and `TAARenderPass`'s average once the view stops; it doesn't follow motion.

## The code

### Write the motion buffer, without multisampling

```ts
const scenePass = pass(scene, camera, { samples: 0 }); // TRAA can't take a multisampled pass
scenePass.setMRT(mrt({ output, velocity })); // velocity: how far each pixel moved
const depth = scenePass.getTextureNode('depth');
renderPipeline.outputNode = traa(scenePass.getTextureNode('output'), depth, scenePass.getTextureNode('velocity'), camera);
```

TRAA shifts the camera itself, by one of 32 spots inside the pixel each frame, and puts it back after the frame. Each new frame counts at least a twentieth (5%), more while things move fast.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Validation errors every frame | The scene pass is multisampled | `pass(scene, camera, { samples: 0 })` |
| Everything smears in motion | Blending without the motion buffer | Write `velocity` and use TRAA |
| A scrolling texture smears | Its motion isn't in the buffer: only moving geometry writes motion | Accept it, or keep such textures still |
| Slightly soft picture | Blending frames softens fine detail | A light sharpen pass, or accept it |
| Edges crawl again in fast motion | Fast-moving pixels lean on the new frame | Expected; it settles when the motion slows |

<div data-mark-done></div>
