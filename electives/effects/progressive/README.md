---
id: effects.progressive.page
elective: effects
kind: page
concepts: [effects.progressive]
renderer: webgpu
---

# Progressive smoothing

> **In short:** While the view holds still, each frame is drawn from a slightly shifted spot and averaged in, until edges and highlights come out clean.
>
> **Used for:** still product shots, screenshots and exports, thin parts and fine stitching, and calming noisy effects like reflections or bounced light.

## What it adds

### Averaged still frames

A pixel shows one color, so an edge crossing it becomes a stair step. Multisampling, what `antialias: true` turns on, checks four points per pixel for which triangle covers it, so outlines come out smooth. But it still lights each pixel once, so a highlight inside a surface, like the glints in the strap's leather grain, stays jagged.

**Progressive smoothing** draws each still frame with the camera shifted by a different fraction of a pixel, and averages the frames. After 32, each pixel holds the average of 32 spots inside it: outlines, highlights, and textures alike. Any move starts the average over. The shadows, glow, and smooth edges page in the jewelry elective takes it apart; this page is about what it costs and when it's worth it.

Think of a long exposure. One quick snapshot is sharp and grainy; holding the shutter open averages the grain away, as long as nothing moves.

Pick **crown, 6× closer**, which enlarges the crown with each pixel kept square. Compare **progressive** with **antialias: true**: both smooth the crown's outline, but only the average smooths the glints on its ridges and the bright line along the case. Then drag the view and watch the average start over.

<div data-scene="adds"></div>

## What it costs

### One draw a frame, then nothing

Averaging draws the scene once a frame, the same as no smoothing, plus a cheap blend into the average. Once 32 frames are in, it stops drawing the scene at all and shows the finished average. Supersampling (SSAA) gets nearly the same picture in a single frame by drawing the scene 16 times, every frame. Multisampling costs extra memory and a little time, and doesn't stop either.

Pick each setting and press **time it**, at pixel ratio 1, then at 2. The readout keeps each setting's time. **Progressive, averaging** keeps restarting so it can be timed; **progressive, 32 in** is timed once the average is finished, which is what a still viewer costs.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer. Runs differ by up to a third, so time each setting twice and trust only bigger gaps. The counts line doesn't change from run to run. three.js can also time each pass on the GPU, but it adds the passes up while the GPU runs them partly at once, so a frame of many passes reads several times too long; the budget page shows how far.

## When to use it

The watch's WebGi setup turns it on: 32 averaged frames once the camera stops, with smoothing over frames while it moves. Its reference picture was captured after the 32 frames were in. Every noisy effect after it, like ambient occlusion and reflections, gets averaged too, for free.

| Use it | Skip it |
| --- | --- |
| A viewer that spends most of its time still | A scene that's always moving or animating |
| Exports and screenshots | Anything where the first frame must be final |
| Noisy effects that need calming when still | A ticking second hand, which starts it over every second |

It doesn't help while the view moves. Pair it with smoothing over frames (the smoothing while moving page) or with multisampling for that.

## The code

### Shift the camera each frame

```ts
const [x, y] = JITTER[frame % 32]; // a spot inside the pixel, 0 to 1
camera.setViewOffset(width, height, x - 0.5, y - 0.5, width, height);
renderPipeline.render();
camera.clearViewOffset(); // back to the real camera before anything else reads it
```

`width` and `height` are the drawing buffer's size in real pixels, `renderer.getDrawingBufferSize()`. The first spot is the pixel's center, so one frame matches a plain one.

### Average it in

```ts
const moved = moveWatcher(camera); // once: compares the camera with the last frame's
if (moved()) frames = 0;           // each frame: the view moved, start over
if (frames >= 32) return;          // done: skip the scene, show the average
weight.value = 1 / ++frames;       // new × 1/n + average × (1 − 1/n)
material.colorNode = mix(texture(average), scenePass.getTextureNode().sample(uv()), weight);
```

three.js's WebGPU nodes don't include one that averages still frames and then stops, so this one is built by hand, in `electives/effects/progressive/smoothing.ts`, with `moveWatcher`. It notices any move, from the controls or from code, and ignores moves under a millionth of a unit, which OrbitControls' damping keeps making after the view looks still. In a plain WebGL viewer, `TAARenderPass` with `accumulate = true` does the same job, as the jewelry elective shows.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Edges and glints still crawl with `antialias: true` | Multisampling only smooths outlines | Average shifted frames when still |
| Jagged again the moment the view moves | Averaging only works on still frames | Smoothing over frames or multisampling while moving |
| It never settles | Something changes every frame (an animation, damping, auto-rotate), restarting the average | Pause animations once the view stops |
| Full cost every frame, even when still | The scene is still drawn after 32 frames are in | Stop drawing the scene and show the average |
| Shimmering parts that move by themselves | A part animates while the camera holds still | Restart when anything in the scene changes, not just the camera |

<div data-mark-done></div>
