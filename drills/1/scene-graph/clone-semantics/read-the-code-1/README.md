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

> **In short:** `clone()` copies objects, with their positions, turns, sizes, and children, but every copied mesh keeps using the original's geometry and material, so changing a material on one copy changes it on all of them.
>
> **Used for:** Filling a warehouse scene with copies of one rack; giving each copy in a configurator its own finish; building a product variant from a model that's already loaded; and working out why memory did, or didn't, grow when copies were added.

## A · The basics

### What a clone gets of its own, and what it shares

The reuse and caching page loaded the J-cups once and cloned them to save memory. This is exactly what a clone gets:

| Its own copy | Shared with the original |
| --- | --- |
| `position`, `rotation`, `scale`, `visible`, `name`, `layers` | `geometry`: the vertex data |
| Its children, cloned the same way | `material`, and every texture the material uses |
| `userData`, copied as JSON (the userData page) | |

A cloned Mesh is a new object that points at the same geometry and the same material as the original. Pass `false`, `clone(false)`, to leave the children out.

**Analogy: a second remote for one TV.** The new remote is its own object: put it anywhere, lose it, and the first one is still there. But press "volume up" on either, and it's the one TV that gets louder. The remote is the Mesh; the TV is its material.

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

The classic bug: a loop that clones a part and sets each clone's color. Every clone, and the original, ends up in the last color, because they all set the same material. Clone the materials you're going to change, then set the color. The scene below adds copies of a J-cup three ways and counts what they cost.

<div data-scene="copies"></div>

- `material.clone()` makes a new material with the same settings. It still shares the textures: a texture is one image on the GPU, however many materials use it.
- Clone only the materials you'll change. Each is one more material to keep track of and, later, to dispose (the disposal ownership page).
- Every copy is still one draw call per Mesh. Hundreds of copies of one mesh in different colors is `InstancedMesh`'s job, with `setColorAt`, on the InstancedMesh page.

### Changing a copy's shape

`copy.scale.y = 1.5` stretches only the copy: it's the copy's own setting. `copy.geometry.scale(1, 1.5, 1)` moves the shared vertices, so the original stretches too. To edit one copy's vertices, give it its own geometry first, `mesh.geometry = mesh.geometry.clone()`, which adds that vertex data to GPU memory.

### What else to know

- The copy has no parent: add it to the scene yourself.
- The copy has the same names as the original, all the way down (the finding objects page).
- Rigged, animated characters need `SkeletonUtils.clone` from the addons instead; character animation is outside this course.
- Disposing a copy's geometry or material disposes the shared one, which the original is still using. The disposal ownership page covers who owns what.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
