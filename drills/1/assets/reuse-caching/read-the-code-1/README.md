---
id: 1.assets.reuse-caching.read-the-code.1
loop: 1
tier: light
concepts: [assets.reuse-caching]
mode: read-the-code
context: assets.reuse-caching/repeated-parts
lenses: []
misconceptions:
  - assets.reuse-caching/same-url-free
---

# Reuse and caching

> **In short:** Every load of a file builds a brand-new copy of everything in it, so load each file once and clone the result, because clones share the original's geometry, materials, and textures.
>
> **Used for:** A warehouse scene with hundreds of identical racks; switching a configurator between variants without loading them again; a parts catalog where the same bolt appears in many assemblies; and tracking down memory that grows every time a user reopens the same model.

## A · The basics

### Loading twice makes two of everything

GLTFLoader doesn't remember what it has loaded. Load the same URL twice and it downloads the file again, or takes it from the browser's cache, then decodes it again and builds new geometries, materials, and textures. The GPU ends up with two full copies, as the runtime memory math page would count them.

### A clone shares

`gltf.scene.clone()` copies the objects, the tree of groups and meshes with their positions, but every cloned mesh points at the same geometry and material as the original, and so at the same textures. A clone costs a few objects on the CPU and one more draw call per mesh, and nothing new in GPU memory.

**Analogy: a rubber stamp.** Loading the file each time is carving a new stamp for every print. Loading once and cloning is carving the stamp once and stamping as many prints as you like: each print is cheap, and they all come from the one stamp.

Add copies of Brad's J-cups both ways and watch what the GPU holds.

<div data-scene="copies"></div>

Because clones share their materials, recoloring a material on one copy recolors every copy. Domain 7's clone semantics page covers what's shared and how to give one copy its own material.

## B · Working knowledge

### Load once, then clone

```js
const loads = new Map();

function loadOnce(url) {
  if (!loads.has(url)) {
    const promise = loader.loadAsync(url);
    promise.catch(() => loads.delete(url)); // let a failed load be tried again
    loads.set(url, promise);
  }
  return loads.get(url);
}

const gltf = await loadOnce('/models/rack.glb');
for (const spot of rackSpots) {
  const rack = gltf.scene.clone();
  rack.position.copy(spot);
  scene.add(rack);
}
```

- **Keep the promise, not the result.** A second call that arrives while the first load is still running gets the same promise and waits for the same load, instead of starting another.
- **Leave the original out of the scene, or use it as the first copy.** Either way, the clones share its resources.
- When hundreds of copies are one mesh each, `InstancedMesh` draws them all in one draw call; the InstancedMesh page in Domain 5 covers it.

### THREE.Cache

```js
THREE.Cache.enabled = true;
```

It's off by default. Turned on, the loaders keep each file's bytes in memory by URL, so a second load skips the download. It still decodes the file and builds a complete new copy, so it saves network time, not memory. The browser's own HTTP cache often skips the download anyway.

### Variant swaps

- **Keep each variant after its first load,** in a map like the one above. Switching back is then just a swap in the scene: no download, no decode, and, if you didn't dispose it, no upload either. The price is keeping it in memory; the preload vs lazy load page weighs that.
- **Share finish materials.** Make one material per finish and assign it to every mesh that uses it, rather than one per mesh.

### Duplicate-load leaks

A panel that loads a model each time it opens and removes it each time it closes adds a full copy to memory on every open, because removing it frees nothing on the GPU. `renderer.info.memory.geometries` climbs with each open. Load it once, or dispose each copy when you remove it, which the disposal ownership page covers.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
