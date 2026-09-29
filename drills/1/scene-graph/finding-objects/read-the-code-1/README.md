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

> **In short:** `getObjectByName` searches an object and everything under it and hands back the first object with exactly that name, and checks like `isMesh` and `isLight` pick out one kind of object.
>
> **Used for:** Hiding one part of a product in a configurator; recoloring every part that uses one finish; finding the lights in a scene someone else lit; and wiring a UI button to a node an artist named in Blender.

## A · The basics

### Ask by name, get the first match

```js
const pin = model.getObjectByName('pin');
```

It searches in the same order as `traverse` on the traverse variants page, starting with `model` itself, and stops at the first object whose `name` is exactly that string. If nothing matches, it returns `undefined` rather than throwing, so the error shows up on the next line that uses the result.

### Names aren't unique

Nothing in three.js keeps names unique. Every object you create starts with the name `''`. GLTFLoader numbers repeated names within one file, but two loads of the same file, or two clones of one model, have the same names all the way down.

**Analogy: calling a name in a crowded room.** Call "Sam!" and the first Sam to hear you answers. There might be three Sams in the room; you get one, and not necessarily the one you meant.

Brad's rack is loaded twice here. Try each search.

<div data-scene="twoRacks"></div>

## B · Working knowledge

### Searching for the right thing

```js
const pin = rackB.getObjectByName('pin');               // search one copy, not the scene
const pins = scene.getObjectsByProperty('name', 'pin'); // every match, in an array
```

Each search walks the tree until it finds a match, so search once after loading and keep the result.

### Blender's names vs three.js's names

As the glTF structure page showed, GLTFLoader cleans every node's name (spaces become `_`, and `.`, `:`, `/`, `[`, and `]` are removed), numbers repeats within one file `_1`, `_2`, and keeps the original in `userData.name`. In the J-cups file, `3X4 J-Cup Pin_MIR:1 [117110]` becomes `3X4_J-Cup_Pin_MIR1_117110`. To search by the name the artist typed, compare `userData.name`:

```js
let safety;
model.traverse((object) => {
  if (!safety && object.userData.name === '(export) flipdown safety 4') safety = object;
});
```

Material names aren't cleaned: the rack's `Zinc.003` keeps its dot.

### Finding by kind

```js
const lights = scene.getObjectsByProperty('isLight', true);
```

Every object has flags for what it is: `isMesh`, `isLight`, `isCamera`, `isGroup`, `isSprite`, and so on, and every one has `isObject3D`. Prefer them to `type`, which is the exact class name: a `SkinnedMesh` has `type` `'SkinnedMesh'`, so `object.type === 'Mesh'` misses it, but its `isMesh` is `true`.

### Grouping by material

```js
const byMaterial = new Map();
model.traverse((object) => {
  if (!object.isMesh) return;
  if (!byMaterial.has(object.material)) byMaterial.set(object.material, []);
  byMaterial.get(object.material).push(object);
});
```

Keyed by the material itself, not its name, the Meshes that really share a material land in one list, ready to recolor together.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
