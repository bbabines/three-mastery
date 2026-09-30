---
id: 1.assets.disposal.read-the-code.1
loop: 1
tier: core
concepts: [assets.disposal]
mode: read-the-code
context: assets.disposal/variant-switching
lenses: []
misconceptions:
  - assets.disposal/remove-frees
  - assets.disposal/dispose-everything
---

# Disposal ownership

> **In short:** A model taken out of the scene keeps its GPU memory until you dispose the parts of it nothing else still needs.
>
> **Used for:** Swapping product variants, leaving a page with a 3D view, kiosks that run for weeks, and slow memory leaks.

## A · The basics

### Removing isn't freeing

`scene.remove(model)` stops the model being drawn, but its geometries, materials, and textures stay on the GPU. three.js can't tell whether you're done with them, since you might add the model back in a moment.

### dispose() frees the GPU copy

```js
geometry.dispose(); // deletes its buffers from GPU memory
material.dispose(); // releases its shader program, but not its textures
texture.dispose();  // deletes the texture from GPU memory
```

Each call frees one thing's GPU copy. The JavaScript object is still there, and if something draws it again, three.js uploads or compiles it again, the same work as the first time.

**Analogy: a rental car.** Parking it in your own garage doesn't stop the charges; returning it does. And you only return the cars you rented, not the one a neighbor lent you.

Pick a way, then swap variants a few times and watch the memory bar.

<div data-scene="swaps"></div>

### Only dispose what nothing else uses

Clones share their geometry, materials, and textures. Disposing them because one copy was removed pulls them out from under the copies still on screen: nothing breaks, but the next render uploads and compiles them all again. The code that loaded a resource frees it, once nothing needs it anymore.

Remove copy A, whose clone B stays on screen, each of the three ways.

<div data-scene="shared"></div>

## B · Working knowledge

### Freeing a model nothing else shares

```js
scene.remove(model);
model.traverse((object) => {
  if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); }
});
```

Materials don't dispose their textures, so collect the textures from each material and call `texture.dispose()` on each. Calling `dispose()` twice is harmless, so meshes that share inside one model need no bookkeeping. `model.dispose()` isn't the same thing: it frees none of the model's geometries, materials, or textures.

### Shared resources: who owns what

```js
const inUse = new Set();
scene.traverse((object) => { if (object.isMesh) inUse.add(object.geometry); });
if (!inUse.has(geometry)) geometry.dispose(); // nothing on screen uses it
```

Count every user, including a cache of variants kept off screen. GLTFLoader's textures also hold a decoded image, which `texture.source.data.close()` frees. After that the texture can never upload again, so close it only when nothing will draw it.

### Leaving a page

When a single-page app leaves a view with a 3D canvas, dispose each model as above, then the tools the view made:

```js
controls.dispose();    // removes its pointer listeners
dracoLoader.dispose(); // ends its decoder workers
renderer.dispose();    // frees the renderer and stops its animation loop
```

Open and close the view a few times: the counts in `renderer.info.memory` should return to where they started.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
