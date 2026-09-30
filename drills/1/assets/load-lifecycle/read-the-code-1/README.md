---
id: 1.assets.load-lifecycle.read-the-code.1
loop: 1
tier: light
concepts: [assets.load-lifecycle]
mode: read-the-code
context: assets.load-lifecycle/loading-indicator
lenses: []
misconceptions:
  - assets.load-lifecycle/onload-no-hitch
---

# Load lifecycle

> **In short:** Loading a file happens in the background: progress while the bytes arrive, then the finished objects or an error.
>
> **Used for:** Progress bars, waiting on a model and its texture together, error messages, and starting an intro once a model arrives.

## A · The basics

### A load happens in the background

A loader call returns straight away, and the file downloads while the page keeps running. three.js reports back at three moments: **progress** as the bytes arrive, **done** with the loaded objects, and **failed** with an error, for a missing file, a broken one, or a missing decoder.

```js
loader.load(url, onLoad, onProgress, onError);
const gltf = await loader.loadAsync(url, onProgress); // rejects if it fails
```

**Analogy: a food delivery app.** You order and carry on with your evening while the app shows "on the way". Food at the door still isn't dinner on the table, and `onLoad` is only the doorbell.

### Done isn't drawn

`onLoad` means the objects exist in JavaScript memory; the GPU hasn't seen them yet. The first render that draws the model uploads its geometry and textures and compiles its shaders, and on a big model that can freeze a frame. The decode, upload, compile page shows how to do that work earlier.

Load the rack model and watch each moment appear, then try the missing file.

<div data-scene="lifecycle"></div>

## B · Working knowledge

### A loading indicator

```js
await loader.loadAsync(url, (event) => {
  if (event.lengthComputable) bar.style.width = `${(100 * event.loaded) / event.total}%`;
});
```

When the server doesn't send the file's size, `event.total` is 0 and `lengthComputable` is `false`, so show a spinner instead. Hide the indicator after the first render, not in `onLoad`, or the page looks ready and then freezes.

### Waiting for loads that depend on each other

```js
const [gltf, logo] = await Promise.all([
  gltfLoader.loadAsync('/models/rack.glb'),
  textureLoader.loadAsync('/textures/logo.png'),
]);
```

Both downloads start at once, and `Promise.all` rejects if either fails. Two `await`s in a row would wait for the model before asking for the logo.

### Error states

```js
loader.load(url, (gltf) => scene.add(gltf.scene), undefined, (error) => {
  message.textContent = "Couldn't load the model.";
});
```

With `load` and no `onError`, GLTFLoader only logs the error to the console, and the user sees an empty scene. With `loadAsync`, catch the rejection. A missing file doesn't always come back as "not found": many servers answer with the site's `index.html`, and GLTFLoader then fails with a JSON error.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
