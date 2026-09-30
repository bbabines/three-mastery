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

> **In short:** Run the same load, show, and unload cycle many times: any count that ends each cycle higher is a leak, however slowly it climbs.
>
> **Used for:** Single-page apps, configurators cycling through variants, kiosks that run for weeks, and tabs that crash after long sessions.

## A · The basics

### Growth that never comes back

Removing a model from the scene frees nothing on the GPU; `dispose()` frees each geometry's, material's, and texture's copy there. A **leak** is what happens when some of that is missed: every time a variant is swapped or a view closed, a little stays behind. One swap's leak is too small to notice, but a kiosk that leaves one texture behind on every swap has a thousand by the end of a busy day.

So the test always has the same shape. Note the counts, run one **cycle** (load, show at least one frame, unload) several times, and note them again. A count that ends each cycle higher than the last is a leak, even if it only grows by 1.

**Analogy: a dripping tap.** One drop is nothing, and you'd never notice it by looking. Leave a cup under it overnight and the cup is full.

Run cycles with each version of the unload code, and watch the counts left after each one. Each variant's label has a normal map as well as a color map.

<div data-scene="cycles"></div>

## B · Working knowledge

### The check, in code

```js
const before = { ...renderer.info.memory };
for (let i = 0; i < 10; i++) await cycle(i); // load, show a frame, unload
console.log(before, renderer.info.memory);   // should match
```

Let frames render: the counts go up when something is uploaded, on the first frame that draws it, so a cycle that never renders proves nothing. Run many cycles: a leak of 1 a cycle is 10 after 10, easy to spot, while a single cycle can hide it among caches that fill up once. `renderer.info.programs.length` counts shader programs, which leak too.

### The texture that got missed

Textures are easy for unload code to miss. `material.dispose()` doesn't dispose the material's textures, so dispose every one it holds:

```js
for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
material.dispose();
```

### What renderer.info can't see

`renderer.info.memory` counts geometries and textures on the GPU. A leak in JavaScript leaves those numbers flat: `dispose()` frees the GPU copies, but the arrays and images stay for as long as anything refers to them. Usual holders are an undo history, a cache that never lets go, and a listener added on every load and never removed.

Chrome's Memory panel finds these: take a heap snapshot, run the cycles, take another, and compare them. Objects like `Mesh` that keep growing between snapshots are the leak.

Swap with each version of the history below, and compare what stays in memory.

<div data-scene="history"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
