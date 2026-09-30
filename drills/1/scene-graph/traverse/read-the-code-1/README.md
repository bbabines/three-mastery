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

> **In short:** Three ways to walk a model's tree: down through everything, down through only what's shown, or up through the parents.
>
> **Used for:** Turning on shadows for a whole model, finding the part a click landed on, counting a model's cost, and debug views.

## A · The basics

### A model is a tree you didn't build

The glTF structure page showed what a loaded model is: `gltf.scene` at the top, an object for every node in the file under it, and Meshes at the ends of the branches. Nobody hands you a list of what's inside.

`model.children` gives only the first level. On the rack model that's its five parts, and none of them is a Mesh. Everything you'd draw, click, or recolor is further down. "Everything under" an object means its children, their children, and so on, at every depth.

**Analogy: a company org chart.** `children` is a manager's direct reports, and `traverse` is everyone under the manager, at every level. `traverseAncestors` is the chain of bosses above one person.

### traverse visits everything under it

```js
const meshes = [];
model.traverse((object) => {
  if (object.isMesh) meshes.push(object);
});
```

`traverse` calls your function on `model` itself first, then follows each branch all the way down before starting the next. Your function gets every kind of object: parts, Groups, empty markers, Meshes, and any lights or cameras, so check what each one is.

### traverseVisible skips hidden branches

`traverseVisible` works the same way, except that when it reaches an object with `visible = false`, it skips that object and everything under it. The objects under a hidden one still say `visible = true`; the walk just never gets to them to ask.

Pick a way to walk the rack, then hide the safety. Each Mesh the walk finds gets a yellow box.

<div data-scene="walk"></div>

## B · Working knowledge

### Doing something to every mesh

```js
model.traverse((object) => {
  if (object.isMesh) object.castShadow = true;
});
```

Setting properties inside the function is fine. Adding or removing objects isn't, since it changes the lists the walk is going through; the safe mutation page covers that. Walk the model, not `scene`, which also reaches the floor grid, the lights, and every label.

### Walking up to the part you care about

A click lands on a Mesh, often a small piece deep inside a part. Walk up until you reach the part. The rack model's parts are named `(export) …` in Blender, so their names start with `(export)`:

```js
let part;
mesh.traverseAncestors((ancestor) => {
  if (!part && ancestor.name.startsWith('(export)')) part = ancestor;
});
```

`traverseAncestors` starts at the parent, not the mesh itself, and goes up to the scene, nearest first. Neither it nor `traverse` can stop early, so a loop over `parent` is the way to stop at the first match:

```js
let part = mesh;
while (part && !part.name.startsWith('(export)')) part = part.parent;
```

Pick where a click landed. The readout lists every parent the walk visited, even after it found the part.

<div data-scene="walkUp"></div>

### Walk once, not every frame

Each walk visits every object it reaches, on the CPU. That's nothing after a load or on a click, but in the frame loop it's CPU time every frame. Collect once after loading, and again whenever the tree changes, then loop over the list in the frame loop:

```js
for (const object of spinners) object.rotation.y += 0.01;
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
