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

> **In short:** Load a file once and clone the result, because a second load builds everything again while clones share what the first one built.
>
> **Used for:** Rows of identical racks, variant swaps, bolts repeated across assemblies, and memory that grows each time a model reopens.

## A · The basics

### Loading twice makes two of everything

GLTFLoader doesn't remember what it has loaded. Load the same URL twice and it decodes the file again and builds new geometries, materials, and textures, so the GPU ends up holding two full copies.

### A clone shares

`gltf.scene.clone()` copies the tree of objects, but every cloned mesh points at the same geometry and material as the original, and so at the same textures. A clone costs a few objects and one more draw call per mesh, and no new GPU memory.

**Analogy: a rubber stamp.** Loading the file for every copy is carving a new stamp for every print. Loading once and cloning is carving one stamp and printing as often as you like.

Add copies of the J-cups both ways and watch what the GPU holds.

<div data-scene="copies"></div>

Because clones share their materials, recoloring one copy recolors every copy. The clone semantics page covers giving one copy its own material.

## B · Working knowledge

### Load once, then clone

```js
function loadOnce(url) {
  if (!loads.has(url)) loads.set(url, loader.loadAsync(url)); // loads: a Map
  return loads.get(url);
}
```

Keep the promise, not the result: a second call made while the first load is still running gets the same promise instead of starting another. Then clone for each copy you place:

```js
const gltf = await loadOnce('/models/rack.glb');
const rack = gltf.scene.clone();
scene.add(rack);
```

### THREE.Cache

```js
THREE.Cache.enabled = true;
```

It's off by default. Turned on, loaders keep each file's bytes by URL, so a second load skips the download but still decodes and builds a full new copy. It saves network time, not memory.

### Variant swaps and leaks

Keep each variant after its first load, in a map like the one above, and switching back is just a swap in the scene. A panel that loads a model on every open and only removes it on close adds a full copy to GPU memory each time, and `renderer.info.memory.geometries` climbs. Load it once, or dispose each copy when you remove it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
