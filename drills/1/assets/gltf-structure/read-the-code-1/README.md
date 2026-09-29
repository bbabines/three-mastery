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

> **In short:** A glTF file is a tree of nodes, where a node can carry a mesh made of one or more primitives (geometry with one material each), and GLTFLoader turns each node into an Object3D and each primitive into its own Mesh.
>
> **Used for:** Finding a part by name to hide or recolor it in a product configurator; checking which materials a model really uses before it ships; working out why a click landed on a mesh nobody named; and a build step that rejects models with too many parts or materials.

## A · The basics

### What's inside a glTF file

glTF is the most common file format for 3D models on the web, and the one three.js supports best. A `.gltf` file is JSON text, usually with a `.bin` file of raw numbers next to it. A `.glb` packs the same JSON and numbers into one binary file. Either way, the JSON is a set of numbered lists whose entries point at each other by number:

| glTF list | What an entry holds | What GLTFLoader makes from it |
| --- | --- | --- |
| `scenes` | Which nodes sit at the top of the tree | `gltf.scene`, a `Group` |
| `nodes` | A name, a position, rotation, and scale, its child nodes, and maybe a mesh | An `Object3D`, a `Mesh`, or a `Group` |
| `meshes` | A list of one or more primitives | One `Mesh` per primitive |
| `accessors` | How to read a run of numbers: how many, in groups of how many, and of what type | A `BufferAttribute` |
| `bufferViews` and `buffers` | The raw bytes (the `.bin` file, or the binary part of a `.glb`) and which slice of them each accessor reads | The numbers in each `BufferAttribute`'s array |
| `materials`, `textures`, `images` | Colors, roughness, and the pictures they use | Usually `MeshStandardMaterial`, and `Texture` |

**Analogy: flat-pack furniture.** The instruction booklet is the JSON: "step 4, fix part C to part A." The numbered bags of parts are the buffers. Nothing is built until you follow the steps, and GLTFLoader is the person following them.

### Nodes, meshes, and primitives

- A **node** is one place in the tree. It has a name, a position, rotation, and scale measured from its parent node, and maybe child nodes. Blender's exporter writes each object as a node, empties included: markers that hold no shape, like the rack's `(slot)` nodes.
- A glTF **mesh** is the shape a node shows. It's a list of **primitives**, and each primitive is a piece of geometry with exactly one material. A part that's half painted steel and half bare metal is one glTF mesh with two primitives.
- A three.js `Mesh` has one geometry and one material, so GLTFLoader makes one Mesh per primitive. If the glTF mesh has one primitive, the node becomes that Mesh. If it has several, the node becomes a `Group` with one Mesh inside it per primitive.

Pick a part of Brad's rack. The box outlines the three.js object its node became, and each Mesh inside it gets its own color. The readout shows the glTF node and mesh it came from.

<div data-scene="tree"></div>

### Why it's easy to miss

In Blender, a part with two materials is still one object with one name. So it's natural to expect one three.js Mesh with that name. The Mesh with that name only exists when the part has one material. With two, the name belongs to a Group, and the Meshes you draw, click, and recolor are its children.

## B · Working knowledge

### Finding a part by its Blender name

GLTFLoader cleans up names before using them: whitespace becomes `_`, and `.`, `:`, `/`, `[`, and `]` are removed. A name that repeats within the file gets `_1`, `_2`, and so on. Each node keeps its original name in `userData.name`.

```js
model.getObjectByName('(mat|main) Tube_90.001'); // undefined: that's the Blender name
model.getObjectByName('(mat|main)_Tube_90001');  // the node, a Group
part.userData.name;                               // '(mat|main) Tube_90.001'
```

- The cleaned names are unique within one load, not across loads. Load the same file twice and both copies have a `(mat|main)_Tube_90001`.
- The Meshes inside a Group are named after the glTF mesh, not the node, and have no `userData.name`. On the rack, the node `(mat|main) Tube_90.001` holds Meshes named `Cube006` and `Cube006_1`.
- Searching by name belongs to Domain 7; the finding objects page covers `getObjectByName` and its relatives.

<div data-scene="names"></div>

### Changing a part that might be a Group

Code that finds a part and sets its material works only when the part is a Mesh:

```js
const tube = model.getObjectByName('(mat|main)_Tube_90001'); // a Group
tube.material.color.set('red');                               // TypeError: a Group has no material
for (const mesh of tube.children) mesh.material.color.set('red'); // each primitive's Mesh
```

- A Group's `material` and `geometry` are `undefined`, so reading through them throws.
- This isn't the same as a three.js geometry with groups and an array of materials, from the groups and multi-material page. GLTFLoader never builds those; it always makes separate Meshes.
- When a click or a search lands on a Mesh named after a glTF mesh, its `parent` is the node you probably meant.

### Auditing materials

To see which materials a model really uses, collect them from its Meshes:

```js
const used = new Set();
model.traverse((object) => {
  if (object.isMesh) used.add(object.material);
});
console.log([...used].map((material) => material.name));
```

Brad's rack uses 11 materials, but `Zinc.001`, `Zinc.002`, and `Zinc.003` have identical settings, and so do `unpainted` and `unpainted.002`. Blender made copies, the file lists each copy, and GLTFLoader loads what the file lists. Merging copies is a job for the artist or an optimizing tool, and it means a finish change touches one material instead of three.

### What's shared already

GLTFLoader shares what the file shares. Nodes that use the same glTF mesh share one geometry and one material: the rack's four `(mat|hardware) Solid036…` and `Solid117…` nodes all use one geometry. Textures that use the same image with the same settings come back as one `Texture`. Changing a shared geometry or material changes every node that uses it. The reuse and caching page picks this up.

### Which space is it in?

| Value | Space |
| --- | --- |
| A node's `translation`, `rotation`, `scale` in the file, loaded into `position`, `quaternion`, `scale` | Measured from its parent node |
| The numbers in a primitive's position accessor, loaded into `geometry.attributes.position` | Measured from the mesh itself |
| What `part.getWorldPosition(v)` gives back | The world, after every parent node and wherever you put `gltf.scene` |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
