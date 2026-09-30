---
id: 1.assets.gltf-structure.read-the-code.1
loop: 1
tier: core
concepts: [assets.gltf-structure]
mode: read-the-code
context: assets.gltf-structure/unexpected-children
lenses: []
misconceptions:
  - assets.gltf-structure/one-mesh
---

# glTF structure

> **In short:** A glTF file is a tree of named parts, and GLTFLoader turns a part whose shape has several materials into a Group of Meshes.
>
> **Used for:** Finding a part by name, auditing a model's materials, explaining extra child meshes, and checking models before they ship.

## A · The basics

### What's inside a glTF file

glTF is the most common format for 3D models on the web. A `.gltf` file is JSON text with a `.bin` file of raw numbers beside it, and a `.glb` packs both into one file. The JSON is a set of numbered lists whose entries point at each other by number: nodes, meshes, materials, and the **accessors** that say how to read the raw numbers. GLTFLoader turns each kind into a three.js object:

| In the file | What GLTFLoader makes |
| --- | --- |
| A node | An `Object3D`, a `Mesh`, or a `Group` |
| A primitive | A `Mesh` |
| An accessor | A `BufferAttribute` |
| A material | Usually a `MeshStandardMaterial` |

**Analogy: flat-pack furniture.** The instruction booklet is the JSON and the numbered bags of parts are the raw numbers. GLTFLoader is the person following the steps.

### Nodes, meshes, and primitives

A **node** is one place in the tree, with a name and a position, rotation, and scale measured from its parent. It may show a glTF **mesh**, which is a list of **primitives**: pieces of geometry with exactly one material each. A part that's half painted steel and half bare metal is one mesh with two primitives. A node can also show nothing, like an empty in Blender.

A three.js `Mesh` holds one geometry and one material, so GLTFLoader makes one Mesh per primitive. With one primitive, the node becomes that Mesh. With two or more, it becomes a `Group` with a Mesh for each primitive inside. In Blender that part is one object with one name, but in three.js the name belongs to the Group, and the Meshes you draw, click, and recolor are its children.

Pick a part of the rack model and compare the glTF node in the readout with the three.js object it became.

<div data-scene="tree"></div>

## B · Working knowledge

### Finding a part by its Blender name

GLTFLoader cleans names as it loads: whitespace becomes `_`, and `.`, `:`, `/`, `[`, and `]` are removed. A name that repeats in the file gets `_1`, `_2`, and so on. The original stays in `userData.name`.

```js
model.getObjectByName('(mat|main) Tube_90.001'); // undefined: the Blender name
model.getObjectByName('(mat|main)_Tube_90001');  // the node, a Group
part.userData.name;                               // '(mat|main) Tube_90.001'
```

Find the tube both ways, then read its `material`.

<div data-scene="names"></div>

### Changing a part that might be a Group

```js
tube.material.color.set('red'); // TypeError: tube is a Group, with no material
for (const mesh of tube.children) mesh.material.color.set('red'); // each Mesh inside
```

A Group's `material` and `geometry` are `undefined`. The Meshes inside are named after the glTF mesh, like `Cube006`, so when a click lands on one, its `parent` is the part you meant.

### Auditing materials

```js
const used = new Set();
model.traverse((object) => { if (object.isMesh) used.add(object.material); });
```

Listing the names in `used` shows what the model really draws with. The rack model has three zinc materials with identical settings, because Blender made copies and GLTFLoader loads what the file lists. Nodes that use the same glTF mesh do share: they get one geometry and one material, so changing it changes every one of them.

### Which space is it in?

| Value | Space |
| --- | --- |
| A node's `position`, `quaternion`, `scale` | Measured from its parent |
| `geometry.attributes.position` | Measured from the object itself |
| `part.getWorldPosition(v)` | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
