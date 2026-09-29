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

> **In short:** To show a model in a different look for a while, save each mesh's material, swap in the new one, and put the saved one back afterwards, because three.js keeps no record of what a mesh wore before.
>
> **Used for:** Highlighting the part under the pointer; an x-ray mode for seeing inside a machine; a debug view that shows which way every surface faces; and graying out the parts that are out of stock.

## A · The basics

### Swapping is one line; undoing it isn't

```js
mesh.material = xray;
```

That line points the mesh at a different material, and the old one is no longer attached to it. three.js keeps no history, so turning x-ray off has nothing to go back to unless your code saved the originals first:

```js
const originals = new Map();
model.traverse((object) => {
  if (!object.isMesh) return;
  originals.set(object, object.material);
  object.material = xray;
});

// x-ray off
for (const [mesh, material] of originals) mesh.material = material;
originals.clear();
```

A `Map` keyed by the mesh keeps the real material objects. Keeping one in `userData`, as the userData page showed, works too, until the mesh is cloned.

**Analogy: dressing shop mannequins for a sale.** Before you put them all in the sale shirt, bag each one's usual outfit and label the bag with its name. Nobody else remembers who wore what.

Pick how x-ray is done, then turn it on and off.

<div data-scene="xray"></div>

## B · Working knowledge

### Highlighting the part under the pointer

```js
function highlight(mesh) {
  if (!originals.has(mesh)) originals.set(mesh, mesh.material);
  mesh.material = glow;
}
function unhighlight(mesh) {
  if (originals.has(mesh)) mesh.material = originals.get(mesh);
  originals.delete(mesh);
}
```

The `has` check matters. A hover check usually runs on every pointer move, so `highlight` gets called again and again for the same part. Without the check, the second call saves `glow` as the "original", and the part never loses its glow.

### Swap, don't recolor

`mesh.material.color.set('orange')` changes the material itself, and every mesh that shares it changes too: the rack's four crossmember bolts share one material, so highlighting one lights up all four, and getting back means remembering the old color yourself. Swapping leaves the shared material alone. The clone semantics page covers sharing.

### scene.overrideMaterial for debug views

```js
scene.overrideMaterial = new MeshNormalMaterial(); // every surface colored by the way it faces
scene.overrideMaterial = null;                     // back to normal
```

- This is the one override that puts itself back, because it never touches `mesh.material`: the renderer uses it in place of each material while drawing.
- It covers everything the scene draws, helpers, the floor grid, and labels included. A material with `allowOverride = false` keeps drawing as itself.
- It's all or nothing. A look for one part needs the swap.

Make the x-ray or highlight material once and share it. Never dispose a saved original you'll put back; the disposal ownership page covers who owns what.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
