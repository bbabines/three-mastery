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

> **In short:** Removing a model from the scene frees none of its GPU memory; `dispose()` on its geometries, materials, and textures does, but only on the ones nothing else still uses.
>
> **Used for:** A configurator that swaps product variants all day without running out of memory; leaving a page of a single-page app, one built with React, Vue, or Svelte, that had a 3D view on it; a kiosk or dashboard that runs for weeks; and tracking down memory that climbs a little with every click.

## A · The basics

### Removing isn't freeing

`scene.remove(model)` takes the model out of the scene, so it's no longer drawn. Its geometries, materials, and textures stay on the GPU. three.js can't tell whether you're done with them: you might add the model back in a moment, the way the variant cache on the reuse and caching page does.

### dispose() frees the GPU copy

```js
geometry.dispose(); // deletes its buffers from GPU memory
material.dispose(); // releases its shader program, but not its textures
texture.dispose();  // deletes the texture from GPU memory
```

Each call frees one thing's GPU copy. The JavaScript object is still there, and if something draws it again, three.js uploads or compiles it again, the same work as the first time.

**Analogy: a rental car.** Parking it in your own garage doesn't stop the rental charges; returning it does. That's remove versus dispose. And you only return the cars you rented, not the one a neighbor lent you, which is the ownership half of this page.

Swap variants both ways. Each swap loads a fresh copy of the next variant and removes the old one; the bar is the GPU memory the models hold.

<div data-scene="swaps"></div>

### Only dispose what nothing else uses

Clones share their geometry, materials, and textures, as the reuse and caching page showed. Disposing them because one copy was removed pulls them out from under the copies still on screen. three.js doesn't crash: the next render just uploads and compiles them again, a stall you didn't need. The rule is ownership: the code that loaded a resource frees it, once nothing needs it anymore.

Remove copy A of a rack whose clone, copy B, stays on screen. The readout counts what's on the GPU right after each choice and after the next render.

<div data-scene="shared"></div>

## B · Working knowledge

### Freeing a model nothing else shares

```js
function disposeModel(model) {
  const textures = new Set();
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry.dispose();
    for (const material of [object.material].flat()) {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    }
  });
  for (const texture of textures) texture.dispose();
}

scene.remove(model);
disposeModel(model);
```

- **Materials don't dispose their textures,** so collect the textures and dispose them yourself.
- **Calling `dispose()` twice is harmless,** so meshes inside one model can share a geometry or material without extra bookkeeping.
- **Use it only for a model nobody else shares:** loaded once for this spot and never cloned.
- **`model.dispose()` isn't this.** r186 gives every Object3D a `dispose()` method, but it frees none of the object's geometries, materials, or textures; the three.js docs say to dispose those separately.

### Shared resources: who owns what

When clones share resources, free them when the last user goes:

```js
const inScene = new Set();
scene.traverse((object) => {
  if (object.isMesh) inScene.add(object.geometry);
});
if (!inScene.has(geometry)) geometry.dispose(); // nothing on screen uses it anymore
```

- **Count every user,** not just what's in the scene: a variant cache from the reuse and caching page holds models that are off screen but still wanted.
- **GLTFLoader's textures hold an `ImageBitmap`,** the decoded image. The GLTFLoader docs warn that image bitmaps aren't freed automatically when nothing references them and need special handling when disposing: `texture.source.data.close()` frees one. After that the texture can never upload again, so close it only when nothing will draw it; a copy still on screen would lose its image, and WebGL logs a warning.

### Leaving a page

When a single-page app leaves a view that has a 3D canvas, free everything the view made:

```js
disposeModel(model);    // for each model the view loaded
controls.dispose();     // removes its pointer listeners
dracoLoader.dispose();  // ends its decoder workers
renderer.dispose();     // frees the renderer's own resources and stops its animation loop
```

Browsers limit how many WebGL canvases can be alive at once, as a rule of thumb about 16 in Chrome, so a view that creates a new renderer each time it opens and never disposes it eventually loses its oldest context.

### Checking for leaks

```js
console.log(renderer.info.memory); // { geometries, textures }
```

Open and close the view, or swap variants a few times and back: the counts should return to where they started. The leak detection page in Domain 14 builds on this.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
