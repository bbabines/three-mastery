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

> **In short:** Preloading gets a model ready before anyone asks for it, so it appears at once but costs startup time and memory; lazy loading waits until it's asked for, which saves both but makes the user wait that first time.
>
> **Used for:** Having the variant a shopper is most likely to pick next ready before they click; not loading the rooms of a virtual tour until the visitor heads toward them; showing the main product first and filling in the accessories after; and keeping a big catalog under a phone's memory limit.

## A · The basics

### Two ways to time a load

- **Preload:** load it before it's needed, at startup or in the background. Switching to it is instant, but the download competes with whatever the user is waiting for first, and it takes memory whether or not anyone uses it.
- **Lazy load:** load it when it's first needed. Startup is quick and memory holds only what's used, but the first use waits for the download and decode, and then the upload and compile from the decode, upload, compile page.

Most apps mix the two: load what the first view needs, show it, then preload what's likely next in the background, and leave the rest until it's asked for.

**Analogy: packing for a trip.** Pack everything you might need and you're ready for anything, but the bag is heavy and you were late leaving. Pack nothing and buy things there, and you leave on time but keep stopping at shops. Most people pack what they'll surely use and buy the rest if it comes up.

Pick a strategy, then switch between Brad's two models. The readout shows what's in memory and whether the last switch was ready or had to wait for a load.

<div data-scene="strategies"></div>

## B · Working knowledge

### Loading the likely next one in the background

```js
const loads = new Map(); // the load-once map from the reuse and caching page
const load = (url) => {
  if (!loads.has(url)) loads.set(url, loader.loadAsync(url));
  return loads.get(url);
};

const first = await load('/models/rack-black.glb');
scene.add(first.scene);
load('/models/rack-white.glb'); // no await: it loads while the user looks at the black one
```

- **A promise starts working when it's created,** not when it's awaited. Leaving off `await` is how you start a load without waiting for it.
- **Start background loads after the first view is up,** so they don't share the network with what the user is waiting for.
- **Warm it up too.** Once it's loaded, `compileAsync` and `initTexture` from the decode, upload, compile page make the first switch smooth as well as instant.

### Priority ordering

```js
const product = await load(productUrl); // what the page is about
scene.add(product.scene);
for (const url of accessoryUrls) await load(url); // then the rest, one at a time
```

Loading in order of importance gets the main thing on screen first. Starting every download at once splits the connection between them, so the most important one finishes later, as a rule of thumb.

### Off-screen models

- **Load on approach or on demand:** when a visitor walks toward a room, or when a menu that shows a model opens.
- **Show something while it loads:** a spinner, or a simple stand-in shape.
- **Free what's far behind** with the disposal ownership page's `dispose()` calls, so memory stays capped however long the tour runs.

### Why not preload everything

Every preloaded model takes its full memory, as the runtime memory math page counts it, whether or not it's ever shown. On a phone that's usually the first limit a big catalog hits. It also delays the first view, because those downloads compete with it. Preload what's likely next, lazy-load the rest, and dispose what's no longer wanted.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
