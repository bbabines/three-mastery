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

> **In short:** Code that runs every frame should reuse a few scratch vectors, matrices, and arrays instead of creating new ones on each call, because every object thrown away is work for the garbage collector, and that work can land in the middle of a frame.
>
> **Used for:** Aiming hundreds of markers, labels, or arrows every frame; raycasting under the pointer on every move; checking bounds and distances for many parts each frame; and physics or animation steps that run many times a second.

## A · The basics

### Every `new` is garbage later

JavaScript frees memory for you. An object that nothing refers to anymore is **garbage**, and the browser's **garbage collector**, or GC, finds and frees it from time to time. Creating a `Vector3` is quick. The cost comes later: collecting takes time on the main thread, the same thread that runs your frame, and it happens when the browser decides.

Per-frame code multiplies it. `new Vector3()` inside a loop over 400 markers makes 400 objects a frame, all garbage by the next one: 24,000 a second at 60 frames a second. Each collection may be short, but as a rule of thumb, garbage at that rate makes them frequent, and a frame that runs into one can miss its refresh (the frame budget page). The result is a stutter every so often, with nothing on screen to explain it.

**Analogy: paper cups at a water cooler.** A fresh cup for every sip costs next to nothing, but the bin fills up, and someone has to stop and empty it whenever it's full, not when it suits you. Refill one mug and there's nothing to empty.

### Make scratch objects once

three.js is built for this. Most of its math methods change the vector they're called on, or write into one you pass in, instead of returning a new one. So make the scratch objects once, outside the frame loop, and reuse them. three.js's own source does the same, with scratch vectors like `_vector` at the top of its files.

```js
const _dir = new Vector3(); // made once
function update() {
  for (const marker of markers) _dir.subVectors(target.position, marker.position); // written into
}
```

Four hundred markers aim at a moving ball, with new objects made in the loop or with scratch objects made once. The picture is the same. The readout counts the objects the loop creates.

<div data-scene="markers"></div>

## B · Working knowledge

### Methods that write into a target

| Makes a new object on every call | Writes into one you made once |
| --- | --- |
| `a.clone().sub(b)` | `_out.subVectors(a, b)` |
| `new Box3().setFromObject(part)` | `_box.setFromObject(part)` |
| `part.getWorldPosition(new Vector3())` | `part.getWorldPosition(_spot)` |
| `raycaster.intersectObjects(parts)`, a new array | `hits.length = 0; raycaster.intersectObjects(parts, true, hits)` |
| `v.toArray()` | `v.toArray(array, offset)` |

- **Clear a reused array first.** `intersectObjects` only adds to the array you pass, then sorts everything in it, so without `hits.length = 0` old hits pile up.
- **Each hit is still new.** three.js makes an object for every hit, with its own `point`. For a ray per pointer move that's fine; for thousands of rays a frame, it adds up.
- `addScaledVector(v, s)` adds `v × s` in place, so a move at a speed needs no temporary vector.

### Scratch objects are shared

A scratch object has one copy, so everything that uses it sees the last value written into it. Return it from a function and keep it, and the next call overwrites what you kept:

```js
const _center = new Vector3();
const centerOf = (part) => _box.setFromObject(part).getCenter(_center);
const a = centerOf(shelfA);
const b = centerOf(shelfB); // a is b: both hold shelfB's center
```

Let the caller pass the target in instead, `centerOf(part, target)`, with targets it made once. Try both versions and move shelf B.

<div data-scene="shared"></div>

### Where it matters

- **Only code that runs often:** the frame loop, `pointermove` handlers, and anything they call. Setup code and click handlers can allocate freely.
- **Finding it:** Chrome's Performance panel shows garbage collection on the main thread's timeline, and its Memory panel can record what's being allocated. Measuring comes in Loop 2.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
