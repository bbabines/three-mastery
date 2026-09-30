---
id: 1.scene-graph.safe-mutation.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.safe-mutation]
mode: read-the-code
context: scene-graph.safe-mutation/remove-helpers
lenses: []
misconceptions:
  - scene-graph.safe-mutation/remove-inside-traverse
---

# Safe mutation

> **In short:** Change the tree after a walk, not during it: note what to add or remove while walking, then do it once the walk ends.
>
> **Used for:** Stripping out debug helpers, swapping meshes for simple stand-ins, splitting a group in two, and emptying a panel.

## A · The basics

### Why the walk breaks

`traverse`, from the traverse variants page, goes through each object's `children` list by position, and it counts the list once, before it starts. Removing an object shifts everything after it up one place. The next object slides into the spot the walk just finished, so the walk skips it. Near the end, the walk reaches positions that are now empty and throws a TypeError.

**Analogy: counting a queue while people leave it.** You point at the third person just as the second walks off. Everyone shuffles forward, so you skip someone, and by the end you're pointing at empty space.

### Collect, then change

Let the walk only read. Collect what you want to change:

```js
const helpers = [];
scene.traverse((object) => {
  if (object instanceof BoxHelper) helpers.push(object);
});
```

Then change the tree in a loop of its own, over a list that nothing else is changing:

```js
for (const helper of helpers) helper.removeFromParent();
```

Changing properties inside a walk is fine: materials, `visible`, `userData`, positions. Only adding and removing objects shifts the lists.

Remove the rack's yellow boxes both ways.

<div data-scene="cleanup"></div>

## B · Working knowledge

### Replacing meshes

Swapping each Mesh for a stand-in inside `traverse` doesn't throw, which makes it worse: some Meshes are quietly skipped, and the walk replaces some of the new stand-ins too. Collect the Meshes first, then swap:

```js
for (const mesh of meshes) {
  mesh.parent.add(makeStandIn(mesh)); // your function: a simple box in the mesh's place
  mesh.removeFromParent();
}
```

Adding a child to each Mesh inside the walk is worse still. The walk goes into each new child and adds another, until the page throws a RangeError.

### Splitting a group

`add` takes an object off its old parent first, since an object has only one parent. So a loop over one group's `children` that adds each child to another group moves every other child, with no error:

```js
for (const child of group.children) door.add(child);      // moves half
for (const child of [...group.children]) door.add(child); // copies the list first: moves them all
```

To empty a group, `group.clear()` removes every child safely.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
