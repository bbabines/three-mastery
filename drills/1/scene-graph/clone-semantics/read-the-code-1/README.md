---
id: 1.scene-graph.clone-semantics.read-the-code.1
loop: 1
tier: core
concepts: [scene-graph.clone-semantics]
mode: read-the-code
context: scene-graph.clone-semantics/per-instance-color
lenses: []
misconceptions:
  - scene-graph.clone-semantics/clone-color-only
---

# Clone semantics

> **In short:** A clone can stand anywhere on its own, but it wears the original's geometry and material, so recoloring either recolors both.
>
> **Used for:** Filling a warehouse with racks, giving each copy its own finish, building product variants, and checking memory use.

## A · The basics

### What a clone gets of its own, and what it shares

The reuse and caching page loaded the J-cups once and cloned them to save memory. `clone()` makes a new object with its own `position`, `rotation`, `scale`, `visible`, `name`, and `userData`, and clones its children the same way. `clone(false)` leaves the children out.

A cloned Mesh is a new object, but it points at the same geometry and the same material as the original, and through the material at the same textures.

**Analogy: a second remote for one TV.** The new remote is its own object: put it anywhere, and the first one is still where you left it. But press "volume up" on either, and it's the one TV that gets louder.

### Recoloring one copy recolors them all

Changing a copy's position moves only that copy, because the position is its own. Changing its material's color changes the one material every copy shares, so the original changes too. To give a copy its own color, give it its own material first:

```js
const copy = rack.clone();
copy.traverse((object) => {
  if (object.isMesh) object.material = object.material.clone();
});
```

Recolor the copy's safety both ways.

<div data-scene="recolor"></div>

## B · Working knowledge

### One color per copy

The classic bug is a loop that clones a part and sets each clone's color. Every clone, and the original, ends up in the last color, because they all set the same material. Clone the material you're going to change, then set the color:

```js
const copy = bolt.clone();
copy.material = copy.material.clone();
copy.material.color.set(color);
```

`material.clone()` makes a new material with the same settings, and it still shares the textures, since a texture is one image on the GPU. Clone only the materials you'll change. Every copy is still one draw call per Mesh; hundreds of copies in different colors is `InstancedMesh`'s job, with `setColorAt`.

Add copies of a J-cup three ways, and compare what they cost.

<div data-scene="copies"></div>

### Changing a copy's shape

`copy.scale.y = 1.5` stretches only the copy: it's the copy's own setting. `copy.geometry.scale(1, 1.5, 1)` moves the shared vertices, so the original stretches too. To edit one copy's vertices, give it its own geometry first, `mesh.geometry = mesh.geometry.clone()`, which adds that vertex data to GPU memory.

### Adding and disposing copies

The copy has no parent, so add it to the scene yourself. It also has the same names as the original, all the way down. And disposing a copy's geometry or material disposes the shared one, which the original is still using.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
