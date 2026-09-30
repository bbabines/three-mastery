---
id: 1.scene-graph.finding-objects.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.finding-objects]
mode: read-the-code
context: scene-graph.finding-objects/find-node
lenses: []
misconceptions:
  - scene-graph.finding-objects/names-unique
  - scene-graph.finding-objects/blender-name
---

# Finding objects

> **In short:** Pulls one object out of a model by its name, or every object of one kind, like all the lights.
>
> **Used for:** Hiding one part of a product, recoloring every part with one finish, finding the lights, and wiring up UI buttons.

## A · The basics

### Ask by name, get the first match

```js
const pin = model.getObjectByName('pin');
```

It searches `model` and everything under it, in the same order as `traverse`, and stops at the first object whose `name` is exactly that string. If nothing matches, it returns `undefined` instead of throwing, so the error shows up on the next line that uses the result.

### Names aren't unique

Nothing in three.js keeps names unique. GLTFLoader numbers repeated names within one file, but two loads of the same file, or two clones of one model, have the same names all the way down.

**Analogy: calling a name in a crowded room.** Call "Sam!" and the first Sam to hear you answers. There might be three Sams in the room, and you get one of them.

The rack model is loaded twice here. Try each search.

<div data-scene="twoRacks"></div>

## B · Working knowledge

### Searching the right place

```js
const pin = rackB.getObjectByName('pin');               // one copy, not the whole scene
const pins = scene.getObjectsByProperty('name', 'pin'); // every match, in an array
```

Each search walks the tree until it finds a match, so search once after loading and keep the result.

### Searching by the Blender name

GLTFLoader cleans every node's name, so `(export) flipdown safety 4` loads as `(export)_flipdown_safety_4`, and it keeps the Blender name in `userData.name`; the glTF structure page has the rules. To search by the Blender name, compare that:

```js
let safety;
model.traverse((object) => {
  if (!safety && object.userData.name === '(export) flipdown safety 4') safety = object;
});
```

### Finding by kind

```js
const lights = scene.getObjectsByProperty('isLight', true);
```

Every object has flags for what it is, like `isMesh`, `isLight`, and `isCamera`. Prefer them to `type`, which is the exact class name: a `SkinnedMesh`'s `type` is `'SkinnedMesh'`, so `type === 'Mesh'` misses it, but its `isMesh` is `true`.

### Grouping by material

Collect the Meshes with `traverse`, then group them by the material itself, not its name, so the Meshes that really share a material land in one list, ready to recolor together:

```js
const byMaterial = Map.groupBy(meshes, (mesh) => mesh.material);
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
