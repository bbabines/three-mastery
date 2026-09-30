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

> **In short:** At 60 Hz each frame has 16.67 ms, the slower of the CPU and the GPU sets the pace, and FPS can't show what's left.
>
> **Used for:** Setting a viewer's performance target, comparing laptops, phones, and 120 Hz screens, and judging whether a fix helped.

## A · The basics

### A deadline at every refresh

A screen redraws at a fixed rate: 60 times a second on most monitors, 120 or more on many newer phones and laptops. `renderer.setAnimationLoop` usually runs your frame once per refresh, so each frame's work has a deadline, the next refresh. That's the **frame budget**: 16.67 ms at 60 Hz and 8.33 ms at 120 Hz. **Frame time** is how long the frame's work actually takes.

### The CPU and the GPU work side by side

A frame's work is split between the CPU (your code and the draw calls) and the GPU (vertices and pixels). They usually overlap: while the GPU draws one frame, the CPU prepares the next. So the frame time is set by the slower of the two, not their sum. A frame that isn't ready at a refresh misses it, and the old frame shows again, which is a stutter.

An FPS counter can't go past the refresh rate. On a 60 Hz screen, a 3 ms frame and a 16 ms frame both read 60.

**Analogy: a train on a fixed timetable.** A passenger who's ready in time catches it, and one who's late waits for the next. Counting trains tells you nobody missed one, not how early anyone arrived.

The timeline is a model. Set each side's work and the refresh rate, and watch the frames go by.

<div data-scene="budget"></div>

## B · Working knowledge

### Budgets by screen

| Refresh rate | Frame budget |
| --- | --- |
| 60 Hz | 16.67 ms |
| 90 Hz | 11.11 ms |
| 120 Hz | 8.33 ms |
| 144 Hz | 6.94 ms |

Aim below the budget, since the browser usually needs part of every frame too. Faster screens shrink it: 12 ms of work fits at 60 Hz but not at 120 Hz. Phones are slower on both sides, so set targets on the slowest device you support.

### Judging a fix in milliseconds

FPS stops at the refresh rate, and its steps aren't even: going from 60 to 50 FPS costs 3.3 ms a frame, but 30 to 25 costs 6.7 ms. Compare frame times instead.

### Fixing the slower side

Cutting CPU time does nothing for a frame the GPU is holding up, and the other way round. Find which side is slower first; the measurement tools page covers the tools that show each one.

### Which number is which?

| Number | What it measures |
| --- | --- |
| Frame budget | The time between refreshes: 1000 ÷ the refresh rate |
| Frame time | How long the frame's work takes: the slower side's share |
| FPS | Frames shown per second, never more than the refresh rate |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
