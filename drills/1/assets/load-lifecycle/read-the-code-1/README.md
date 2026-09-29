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

> **In short:** A load runs in the background while the page carries on, reports its progress as the file downloads, and ends by handing over the loaded objects or an error.
>
> **Used for:** A progress bar while a product model downloads; waiting for a model and the texture that goes on it before showing either; a "couldn't load this model" message instead of a blank screen; and starting an intro animation only once the model has arrived.

## A · The basics

### A load happens in the background

The loaders tour showed the two ways to call a loader. Either way, the call returns straight away and the file downloads in the background while the page keeps running. three.js reports back at three moments:

- **Progress**, while the bytes arrive: `event.loaded` bytes so far, out of `event.total`.
- **Done**, with the loaded objects: `onLoad` runs, or the `loadAsync` promise resolves.
- **Failed**, with an error: `onError` runs, or the promise rejects. A missing file, a server error, a broken file, and a missing decoder all end up here.

```js
loader.load(url, onLoad, onProgress, onError);
const gltf = await loader.loadAsync(url, onProgress); // progress is the second argument
```

**Analogy: a food delivery app.** You order and get on with your evening. The app shows "preparing" and "on the way", and then the food is at the door or the order is cancelled. Food at the door still isn't dinner on the table: someone has to unpack it and plate it. `onLoad` is the doorbell.

### Done isn't drawn

`onLoad` means the objects exist: the geometry, materials, and textures are built in JavaScript memory. The GPU hasn't seen any of it. The first render that draws the model copies its geometry and textures to the GPU and compiles its shaders, the small programs the GPU runs to draw each material. That's work on the main thread, and on a big model it can freeze a frame or several. The decode, upload, compile page covers how to do that work earlier.

Load the rack and watch the readout. Each line appears as its moment happens, and the last line counts what the first render sent to the GPU. There are fewer geometries than meshes because some meshes share one. The second button loads a file that doesn't exist.

<div data-scene="lifecycle"></div>

## B · Working knowledge

### A loading indicator

```js
const gltf = await loader.loadAsync(url, (event) => {
  if (event.lengthComputable) bar.style.width = `${(100 * event.loaded) / event.total}%`;
});
```

- **`event.total` is 0 when the server doesn't send the file size.** `lengthComputable` is then `false`, and `loaded / total` is `Infinity`. Show a spinner instead of a bar in that case.
- **Progress covers the file you asked for, not what it points to.** A `.glb` holds everything, so its progress is the whole model. A `.gltf` loads its `.bin` and textures afterwards, and those aren't in its progress, so the bar reaches 100% early. `TextureLoader` reports no progress at all.
- **Hide the indicator after the first render, not in `onLoad`,** or the page looks ready and then freezes.

### Counting files with a LoadingManager

```js
const manager = new LoadingManager();
manager.onProgress = (url, itemsLoaded, itemsTotal) => (label.textContent = `${itemsLoaded} of ${itemsTotal} files`);
manager.onLoad = () => (label.hidden = true);
const loader = new GLTFLoader(manager);
```

A LoadingManager counts files, not bytes, across every loader you hand it. The total grows as loaders find more files to fetch, like the textures a `.gltf` points to, so a percentage made from it can jump backwards.

### Waiting for things that depend on each other

When a texture goes onto a material from a model, both have to be done first. Start them together:

```js
const [gltf, logo] = await Promise.all([
  gltfLoader.loadAsync('/models/rack.glb'),
  textureLoader.loadAsync('/textures/logo.png'),
]);
logo.colorSpace = SRGBColorSpace;
logo.flipY = false; // glTF UVs expect this; GLTFLoader sets it on its own textures
gltf.scene.getObjectByName('Sign').material.map = logo; // Sign is a one-material Mesh
```

Both downloads start at once, because both calls run before anything waits. `Promise.all` then waits for both, and rejects if either fails. Two `await`s in a row would wait for the model before asking for the logo.

### Error states

```js
try {
  const gltf = await loader.loadAsync(url);
  scene.add(gltf.scene);
} catch (error) {
  message.textContent = "Couldn't load the model.";
  console.error(error);
}
```

- **With `load` and no `onError`, GLTFLoader only logs the error to the console.** The user sees an empty scene and no message.
- **A missing file doesn't always come back as "not found".** Many servers, this repo's dev server included, answer a request for a missing file with the site's `index.html`. GLTFLoader then fails on the HTML with "Unexpected token '<' … is not valid JSON". When a real "not found" does come back, the error has the response on it: `error.response.status` is 404.
- A load can also fail after the download, while parsing: a corrupt file, or a compressed one with no decoder attached.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
