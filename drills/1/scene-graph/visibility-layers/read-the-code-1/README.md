---
id: 1.scene-graph.visibility-layers.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.visibility-layers]
mode: read-the-code
context: scene-graph.visibility-layers/hide-part
lenses: []
misconceptions:
  - scene-graph.visibility-layers/invisible-raycast
---

# Visibility, removal, layers

> **In short:** Hiding, removing, and layers all stop something being drawn, but they differ in what clicks can still hit and what stays in the scene.
>
> **Used for:** Hiding a shelf in a configurator, keeping clicks off helpers, showing lines in one view only, and seeing inside buildings.

## A · The basics

### Three ways to make something disappear

A **raycast** shoots a line into the scene and lists what it passes through; it's how a click finds what's under the pointer.

`part.visible = false` stops the part, and everything under it, being drawn, but it stays in the scene, and a raycast still hits it. `part.removeFromParent()` takes it out of the scene, so a raycast over the scene can't reach it, though the object still exists. Layers are the third way, and they let each camera and raycaster choose what it deals with.

**Analogy: a shop window.** Switching off a display's light hides the item, but a customer reaching in still bumps into it. Taking it to the stockroom empties the window, though the item still exists.

### Layers test each object on its own

Every object, camera, and raycaster starts on layer 0 of 32. A camera draws an object when they share a layer, and a raycaster only tests objects it shares a layer with. Unlike `visible`, layers are checked on each object by itself: putting a Group on layer 1 leaves the Meshes inside it on layer 0. To move a whole part, set everything under it:

```js
part.traverse((object) => object.layers.set(1));
```

A scanner fires a fixed ray through the rack's upright tube. Try each way of making the tube disappear, and watch what's drawn and what the ray hits.

<div data-scene="hideTube"></div>

## B · Working knowledge

### Hiding a part

`visible = false` is the quick switch, and `visible = true` brings the part straight back. But a hidden part still has its matrices refreshed every render and still counts in `Box3.setFromObject`. Removing it avoids both. Neither frees any memory.

### Keeping clicks off hidden parts

A raycast doesn't check `visible`, so filter the hits yourself. Checking `hit.object.visible` isn't enough, since the Meshes under a hidden part still say `true`. Check every parent too:

```js
const isShown = (object) => object.visible && (!object.parent || isShown(object.parent));
const hits = raycaster.intersectObject(model).filter((hit) => isShown(hit.object));
```

### Layers for helpers and second views

```js
helper.layers.set(1);
camera.layers.enable(1); // draws layers 0 and 1; raycasters still test only layer 0
measureLines.traverse((object) => object.layers.set(2));
plannerCamera.layers.enable(2); // only the planner's camera shows the lines
```

`layers.set(n)` puts an object on layer `n` only, and `enable(n)` adds a layer and keeps the others.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
