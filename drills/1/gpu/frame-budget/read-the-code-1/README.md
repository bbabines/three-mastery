---
id: 1.gpu.frame-budget.read-the-code.1
loop: 1
tier: core
concepts: [gpu.frame-budget]
mode: read-the-code
context: gpu.frame-budget/setting-targets
lenses: []
misconceptions:
  - gpu.frame-budget/fps-headroom
---

# Frame budget

> **In short:** At 60 frames a second each frame gets 16.67 milliseconds, the CPU and the GPU each have to finish their share of the work within it, and an FPS counter can't tell you how much of it is left.
>
> **Used for:** Setting a performance target for a product viewer; comparing a laptop, a phone, and a 120 Hz screen; judging whether a fix really helped; and deciding which side of a slow frame, CPU or GPU, to work on.

## A · The basics

### A deadline at every refresh

A screen redraws at a fixed rate: 60 times a second on most monitors, 120 or more on many newer phones and laptops. `renderer.setAnimationLoop` runs your frame through the browser's `requestAnimationFrame`, which MDN says generally runs at the display's refresh rate. So each frame's work has a deadline, the next refresh: 1000 ms ÷ 60 = 16.67 ms at 60 Hz, and 8.33 ms at 120 Hz. That's the **frame budget**. **Frame time** is how long the frame's work actually takes.

### The CPU and the GPU work side by side

A frame's work is split between the CPU (your code, matrix updates, draw calls) and the GPU (vertices and pixels). They don't take turns. While the GPU draws one frame, the CPU is already preparing the next, so as a rule of thumb the frame time is set by the **slower** of the two, not their sum. A frame that isn't ready when the screen refreshes misses it: the screen shows the old frame again, and the new one appears a refresh later, which is what a stutter is.

And the FPS counter can't go past the refresh rate. On a 60 Hz screen, a frame that takes 3 ms and a frame that takes 16 ms both show 60 FPS: the counter says the budget was met, not by how much.

**Analogy: a prep cook, a line cook, and a waiter who comes by on a schedule.** The prep cook (the CPU) readies the next order while the line cook (the GPU) cooks this one, so orders come out as fast as the slower cook, not the two added together. But dishes only leave with the waiter, who comes by at fixed times (the refreshes). Fast cooks still serve one dish per round; a slow one makes a dish wait for the next round.

This is a model, not a measurement: set the CPU's and the GPU's work per frame and the refresh rate, and watch four frames go by. Each color is one frame: its CPU work on the top lane, its GPU work below, and the gray lines are the screen's refreshes.

<div data-scene="budget"></div>

## B · Working knowledge

### Budgets by screen

| Refresh rate | Frame budget |
| --- | --- |
| 60 Hz | 16.67 ms |
| 90 Hz | 11.11 ms |
| 120 Hz | 8.33 ms |
| 144 Hz | 6.94 ms |

- **Aim below it.** As a rule of thumb, the browser needs part of every frame too, for events, layout, and putting the page together, so a frame whose own work takes the whole 16.67 ms will miss some refreshes.
- **Faster screens halve the budget.** A scene that fits at 60 Hz with 12 ms of work misses every refresh at 120 Hz, where the budget is 8.33 ms.
- **Phones are slower on both sides** and often draw at a pixel ratio of 3, so set targets on the slowest device you support. The renderer settings tour covers capping the pixel ratio.

### Judge work in milliseconds, not FPS

- **FPS stops at the refresh rate,** so a steady 60 says nothing about the time left.
- **FPS changes aren't even:** going from 60 to 50 FPS costs 3.3 ms per frame, from 30 to 25 FPS it costs 6.7 ms. Compare frame times.
- **Fix the slower side.** Cutting CPU time does nothing for a frame the GPU is holding up, and the other way round. Loop 3's proof experiments work out which side is slower; the measurement tools page covers the tools that show each side's time.

### Which number is which?

| Number | What it measures |
| --- | --- |
| Frame budget | The time between refreshes: 1000 ÷ the refresh rate |
| Frame time | How long the frame's work takes: the slower of the CPU's and the GPU's share |
| FPS | Frames shown per second, never more than the refresh rate |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
