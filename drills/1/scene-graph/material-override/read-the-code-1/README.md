---
id: 1.scene-graph.material-override.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.material-override]
mode: read-the-code
context: scene-graph.material-override/x-ray
lenses: []
misconceptions:
  - scene-graph.material-override/auto-restore
---

# Material override and restore

> **In short:** three.js forgets a mesh's old material the moment you swap in a new one, so save the original if you want it back.
>
> **Used for:** Highlighting the part under the pointer, x-ray views, debug views of which way surfaces face, and graying out sold-out parts.

## A · The basics

### Swapping is one line; undoing it isn't

`mesh.material = xray` is all it takes to swap a material. The old one is no longer attached to the mesh, and three.js keeps no history, so turning x-ray off has nothing to go back to unless your code saved it.

**Analogy: dressing shop mannequins for a sale.** Before you put them all in the sale shirt, bag each one's usual outfit and label the bag with its name. Nobody else remembers who wore what.

### Save, swap, put back

Collect the meshes with `traverse`, then save each material in a `Map` keyed by the mesh before swapping:

```js
for (const mesh of meshes) {
  originals.set(mesh, mesh.material); // originals: a Map
  mesh.material = xray;
}
```

To turn x-ray off, put each one back:

```js
for (const [mesh, material] of originals) mesh.material = material;
originals.clear();
```

Pick how x-ray is done, then turn it on and off.

<div data-scene="xray"></div>

## B · Working knowledge

### Highlighting the part under the pointer

```js
function highlight(mesh) {
  if (!originals.has(mesh)) originals.set(mesh, mesh.material);
  mesh.material = glow;
}
```

The `has` check matters. A hover check usually runs on every pointer move, so `highlight` is called again and again for the same part. Without the check, the second call saves `glow` as the "original", and the part never loses its glow. To unhighlight, put `originals.get(mesh)` back and delete the entry.

### Swap, don't recolor

`mesh.material.color.set('orange')` changes the material itself, so every mesh that shares it changes too. The rack's four crossmember bolts share one material, so recoloring one lights up all four. Swapping leaves the shared material alone.

### scene.overrideMaterial for debug views

```js
scene.overrideMaterial = new MeshNormalMaterial(); // every surface colored by the way it faces
scene.overrideMaterial = null;                     // back to normal
```

This is the one override that puts itself back, because it never touches `mesh.material`: the renderer uses it in place of each material while drawing. It covers everything the scene draws, helpers and labels included, so a look for one part needs the swap.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
