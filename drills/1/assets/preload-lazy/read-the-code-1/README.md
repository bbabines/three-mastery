---
id: 1.assets.preload-lazy.read-the-code.1
loop: 1
tier: light
concepts: [assets.preload-lazy]
mode: read-the-code
context: assets.preload-lazy/likely-next
lenses: []
misconceptions:
  - assets.preload-lazy/preload-everything
---

# Preload vs lazy load

> **In short:** Load a model early and it's ready at once but costs startup time and memory; load it when asked for and the user waits once.
>
> **Used for:** The likely next variant, rooms of a tour, accessories after the main product, and big catalogs on phones.

## A · The basics

### Two ways to time a load

**Preloading** loads a model before it's needed, at startup or in the background. Switching to it is instant, but the download competes with what the user is waiting for, and it takes memory whether or not anyone looks at it. **Lazy loading** waits until it's first needed: startup is quick and memory holds only what's used, but the first use waits for the download, decode, upload, and compile.

Most apps mix the two: show the first view, preload what's likely next in the background, and leave the rest until it's asked for.

**Analogy: packing for a trip.** Pack everything and you're ready for anything, but the bag is heavy and you leave late. Pack nothing and you keep stopping at shops, so most people pack what they'll surely use and buy the rest if it comes up.

Pick a strategy, then switch between the two models and watch whether each switch was ready or had to wait.

<div data-scene="strategies"></div>

## B · Working knowledge

### Loading the likely next one in the background

```js
const first = await load('/models/rack-black.glb'); // load: a load-once helper
scene.add(first.scene);
load('/models/rack-white.glb'); // no await: it loads in the background
```

A load starts when it's called, not when it's awaited, so leaving off `await` starts it without waiting. Start background loads after the first view is up, and warm them up with `compileAsync` so the first switch is smooth as well as instant.

### Priority ordering

```js
scene.add((await load(productUrl)).scene);        // the main thing first
for (const url of accessoryUrls) await load(url); // then the rest, one at a time
```

Starting every download at once splits the connection, so the most important one usually finishes later.

### Off-screen models

Load a room when the visitor heads toward it, or a model when its menu opens, and show a spinner or a stand-in shape meanwhile. Dispose what's far behind, so memory stays capped however long the tour runs. Preloading everything holds every model's memory at once, and on a phone that's usually the first limit a big catalog hits.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
