---
id: 1.optimization.allocation-hygiene.read-the-code.1
loop: 1
tier: core
concepts: [optimization.allocation-hygiene]
mode: read-the-code
context: optimization.allocation-hygiene/per-frame-updates
lenses: []
misconceptions:
  - optimization.allocation-hygiene/gc-too-small
---

# Allocation hygiene

> **In short:** Per-frame code should reuse a few objects made once, since every object thrown away is later work for the garbage collector.
>
> **Used for:** Aiming hundreds of markers, raycasting on every pointer move, per-frame bounds checks, and physics steps.

## A · The basics

### Every `new` is garbage later

JavaScript frees memory for you. An object nothing refers to anymore is **garbage**, and the browser's **garbage collector** frees it from time to time, on the same main thread that runs your frame, at a moment the browser picks.

Per-frame code multiplies it. `new Vector3()` in a loop over 400 markers makes 400 objects a frame, tens of thousands a second. Garbage at that rate usually makes collections frequent, and a frame that runs into one can miss its refresh: a stutter, with nothing on screen to explain it.

**Analogy: paper cups at a water cooler.** A fresh cup for every sip costs next to nothing, but the bin fills, and someone has to stop and empty it whenever it's full. Refill one mug and there's nothing to empty.

### Make scratch objects once

Most three.js math methods change the vector they're called on, or write into one you pass in. So make **scratch objects** once, outside the loop, and reuse them every frame:

```js
const _dir = new Vector3(); // made once
for (const marker of markers) _dir.subVectors(target.position, marker.position);
```

Switch between the two versions. The picture is the same; watch how many objects each frame creates.

<div data-scene="markers"></div>

## B · Working knowledge

### Methods that write into a target

| Makes a new object every call | Writes into one made once |
| --- | --- |
| `a.clone().sub(b)` | `_out.subVectors(a, b)` |
| `new Box3().setFromObject(part)` | `_box.setFromObject(part)` |
| `part.getWorldPosition(new Vector3())` | `part.getWorldPosition(_spot)` |
| `raycaster.intersectObjects(parts)` | `raycaster.intersectObjects(parts, true, hits)` |

`intersectObjects` only adds to the array you pass, then sorts all of it, so set `hits.length = 0` before each call. `addScaledVector(v, s)` adds `v` times `s` in place, so a move at a speed needs no temporary vector.

### Scratch objects are shared

A scratch object has one copy, so a function that returns it hands every caller the same vector:

```js
const centerOf = (part) => _box.setFromObject(part).getCenter(_center);
const a = centerOf(shelfA);
const b = centerOf(shelfB); // a is b: both hold shelfB's center
```

Let the caller pass the target in instead, `centerOf(part, target)`. Try both versions and move shelf B.

<div data-scene="shared"></div>

### Where it matters

Only in code that runs often: the frame loop, `pointermove` handlers, and whatever they call. Setup code and click handlers can allocate freely. Chrome's Performance panel shows garbage collection on the main thread's timeline.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
