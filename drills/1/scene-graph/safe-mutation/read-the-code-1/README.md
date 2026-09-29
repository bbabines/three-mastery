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

> **In short:** Adding or removing objects while `traverse` is walking the tree breaks the walk, so collect what you want to change first, then change the tree afterward.
>
> **Used for:** Stripping debug helpers out of a scene before a screenshot; swapping a model's detailed meshes for simple stand-ins on a slow phone; moving some of a model's parts into their own group so they can open like a door; and emptying a panel when a user closes it.

## A · The basics

### Why the walk breaks

`traverse`, from the traverse variants page, goes through each object's `children` list by position, first, second, third, and it counts the list once, before it starts. Removing an object shifts everything after it up one place:

- The next object slides into the spot the walk just finished, so the walk skips it.
- Near the end, the walk reaches positions that are now empty and throws a TypeError: `Cannot read properties of undefined (reading 'traverse')`.

**Analogy: counting a queue while people leave it.** You point at the third person just as the second walks off. Everyone shuffles forward and you've skipped someone. By the end you're pointing at empty space.

### Collect, then change

```js
const helpers = [];
scene.traverse((object) => {
  if (object instanceof BoxHelper) helpers.push(object);
});
for (const helper of helpers) helper.removeFromParent();
```

The walk only reads. The loop afterwards changes the tree, going through a list that nothing else is changing. Changing properties inside a walk is fine (materials, `visible`, `userData`, positions); only adding and removing objects shifts the lists.

A yellow box surrounds each of the rack's five parts. Remove them both ways.

<div data-scene="cleanup"></div>

## B · Working knowledge

### Replacing meshes

Swapping each Mesh for a stand-in inside `traverse` doesn't throw, which makes it worse: some Meshes are quietly skipped, and the walk reaches some of the new stand-ins and replaces those in turn. Collect first:

```js
const meshes = [];
model.traverse((object) => {
  if (object.isMesh) meshes.push(object);
});
for (const mesh of meshes) {
  mesh.parent.add(makeStandIn(mesh)); // your function: a simple box in the mesh's place
  mesh.removeFromParent();
}
```

Adding a child to each Mesh inside the walk is worse still: the walk goes into the new child, adds a child to that, and so on, until the page throws a RangeError, `Maximum call stack size exceeded`.

### Splitting a group

`add` takes an object off its old parent first, since an object has only one parent (the Object3D API tour). So a loop over one group's `children` that adds each child to another group moves every other child and skips the rest, with no error:

```js
for (const child of group.children) door.add(child);      // moves half
for (const child of [...group.children]) door.add(child); // copies the list first: moves them all
```

`attach` in place of `add` keeps each child where it is in the world; the add vs attach page covers it. To empty a group, `group.clear()` removes every child safely.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
