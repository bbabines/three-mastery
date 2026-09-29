---
id: 1.scene-graph.traverse.read-the-code.1
loop: 1
tier: core
concepts: [scene-graph.traverse]
mode: read-the-code
context: scene-graph.traverse/collect-meshes
lenses: []
misconceptions:
  - scene-graph.traverse/visible-children
---

# Traverse variants

> **In short:** `traverse` runs your function on an object and everything under it, at every depth, so you can question a model you didn't build; `traverseVisible` skips hidden branches, and `traverseAncestors` walks up instead.
>
> **Used for:** Turning on shadows for every mesh in a loaded model; finding which product a clicked bolt belongs to; counting what a model will cost before it ships; and switching a whole model to an x-ray look for a debug view.

## A · The basics

### A model is a tree you didn't build

The glTF structure page showed what GLTFLoader hands you: `gltf.scene` at the top, an object for every node in the file under it, and Meshes at the ends of the branches. Nobody hands you a list of what's inside. Brad's rack is 56 objects in four levels: `gltf.scene`; its five parts; the Groups, Meshes, and empty marker nodes inside each part; and the Meshes inside those Groups.

`model.children` gives only the first level. On the rack that's the five parts, and none of them is a Mesh. Everything you'd draw, click, or recolor is further down. "Everything under" an object means its children, their children, and so on, at every depth.

**Analogy: a company org chart.** `children` is a manager's direct reports. `traverse` is everyone under the manager, at every level. `traverseAncestors` is the chain of bosses above one person, up to the CEO.

### traverse visits everything under it

```js
const meshes = [];
model.traverse((object) => {
  if (object.isMesh) meshes.push(object);
});
```

`traverse` calls your function on `model` itself first, then follows each branch all the way down before starting the next. Your function gets every kind of object: parts, Groups, empty markers, Meshes, and any lights or cameras. `object.isMesh` keeps only the Meshes; the finding objects page covers these checks.

### traverseVisible skips hidden branches

`traverseVisible` works the same way, except that when it reaches an object with `visible = false`, it skips that object and everything under it. The objects under a hidden one still say `visible = true`, as on the Object3D API tour, but `traverseVisible` never gets to them to ask.

Pick a way to walk the rack, then hide the safety. Every Mesh the walk found gets a yellow box. With `traverse`, the hidden safety's Meshes still get boxes, in empty space.

<div data-scene="walk"></div>

## B · Working knowledge

### Doing something to every mesh

```js
model.traverse((object) => {
  if (object.isMesh) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
});
```

- Setting properties inside the function is fine. Adding or removing objects isn't: it changes the lists `traverse` is walking. The safe mutation page covers that.
- `scene.traverse` reaches everything in the scene: helpers like the floor grid, lights, labels, and your UI objects. Walk the model instead, or check what each object is.

### Walking up to the part you care about

A click lands on a Mesh (the raycasting pages in the spatial queries domain cover how). That Mesh is often one primitive of a part, deep inside a product. Walk up until you reach the part you mean. Brad names his parts `(export) …` in Blender, so the cleaned names start with `(export)`:

```js
let part;
mesh.traverseAncestors((ancestor) => {
  if (!part && ancestor.name.startsWith('(export)')) part = ancestor;
});
```

- `traverseAncestors` starts at the parent, not the object itself, and goes up to the scene, nearest first.
- Neither it nor `traverse` can stop early: what your function returns is ignored. A loop over `parent` stops as soon as it finds the part:

```js
let part = mesh;
while (part && !part.name.startsWith('(export)')) part = part.parent;
```

Marking parts with your own data instead of relying on names is the userData page's job.

Pick where a click landed. The Mesh is boxed in green and the part the code settles on in yellow. The readout lists every object `traverseAncestors` visited, including the ones above the part, after the answer was already found.

<div data-scene="walkUp"></div>

### What traverseVisible doesn't check

It checks `visible` and nothing else. It still visits objects that are off screen, on a layer the camera doesn't draw (the visibility, removal, layers page), or whose material has `visible = false`. Called on a hidden object, it visits nothing at all, not even that object.

### Walk once, not every frame

Each call visits every object it reaches, one at a time, on the CPU. That's nothing when a model loads or a user clicks. In the frame loop it's CPU time every frame, growing with the size of the scene, even if only three objects need anything. Collect once and keep the list:

```js
const spinners = [];
model.traverse((object) => {
  if (object.userData.spins) spinners.push(object);
});

renderer.setAnimationLoop(() => {
  for (const object of spinners) object.rotation.y += 0.01;
  renderer.render(scene, camera);
});
```

Collect again whenever the tree changes: after a load, or after adding or removing parts.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
