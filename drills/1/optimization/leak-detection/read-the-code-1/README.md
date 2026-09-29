---
id: 1.optimization.leak-detection.read-the-code.1
loop: 1
tier: core
concepts: [optimization.leak-detection]
mode: read-the-code
context: optimization.leak-detection/variant-cycling
lenses: []
misconceptions:
  - optimization.leak-detection/slow-growth-fine
---

# Leak detection

> **In short:** A leak is memory that should have been freed but wasn't, and you find it by repeating one load-and-unload cycle and checking that the counts come back to where they started; any count that keeps climbing is a leak, however slowly it climbs.
>
> **Used for:** A single-page app whose 3D view opens and closes all day; a configurator where shoppers cycle through dozens of variants; a kiosk or dashboard that runs for weeks; and tracking down why a phone tab crashes after a long session.

## A · The basics

### Growth that never comes back

The disposal ownership page showed that removing a model frees nothing, and that `dispose()` frees each geometry's, material's, and texture's GPU copy. A **leak** is what happens when some of that is missed: every time a variant is swapped or a view is closed, a little stays behind. One cycle's leak is too small to notice. A kiosk that leaves one texture behind on every product swap has a thousand of them by the end of a busy day.

So the test always has the same shape: note the counts, run one cycle (load, show, unload) several times, and note them again. Healthy code comes back to the same numbers after every cycle. A count that ends each cycle higher than the last is a leak, even if it only grows by 1.

**Analogy: a dripping tap.** One drop is nothing, and you'd never notice it by looking. Leave a cup under it overnight and the cup is full. Running cycles and counting is the cup.

Each variant is three parts, and the label part has a normal map as well as a color map. Run cycles with each version of the unload code. The readout shows `renderer.info.memory` after each cycle. The floor grid is hidden so it doesn't add to the counts, and the textures never drop below 1: three.js keeps one small texture of its own, a lookup table for Standard and Physical materials.

<div data-scene="cycles"></div>

## B · Working knowledge

### The check, in code

```js
const before = { ...renderer.info.memory };
for (let i = 0; i < 10; i++) {
  await showVariant(i);   // load it, add it, and let a frame render
  unloadVariant(i);       // remove it and dispose what it owns
}
console.log(before, renderer.info.memory); // should match
```

- **Let frames render.** The counts go up when something is uploaded, on the first frame that draws it. A cycle that never renders proves nothing.
- **Run many cycles.** A leak of 1 per cycle is 10 after 10, which is easy to spot, while a single cycle can hide it among caches that fill up once.
- `renderer.info.programs.length` counts shader programs. They leak too, when each cycle makes materials with new settings and never disposes them.

### What renderer.info can't see

`renderer.info.memory` counts geometries and textures on the GPU. A leak in JavaScript leaves those numbers flat: `dispose()` frees the GPU copies, but the arrays and images stay in JavaScript for as long as anything refers to them. Common holders:

- a list of old models, like an undo history, or a cache that never lets go;
- event listeners added on every load and never removed, like `window.addEventListener('resize', …)` or a controls `change` listener;
- a callback in the frame loop that still refers to a model from an old view.

Chrome's Memory panel finds these: take a heap snapshot, run the cycles, take another, and compare the two. Objects like `Mesh` and `BufferGeometry` that keep growing between snapshots are the leak. Here the old variants are disposed but kept in a history list:

<div data-scene="history"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
