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

> **In short:** `visible = false` stops something being drawn but leaves it in the scene, where raycasts still hit it; removing it takes it out of the scene; and layers let each camera and each raycaster choose which objects it deals with, one object at a time.
>
> **Used for:** Hiding a shelf a shopper took out in a configurator; keeping clicks from landing on debug helpers and labels; showing measurement lines in a planner's view but not the customer's; and hiding a roof so the camera can look into a building.

## A · The basics

### Three ways to make something disappear

A **raycast** shoots a line through the scene and lists what it passes through; it's how a click finds what's under the pointer. The raycasting pages in the spatial queries domain teach it. Here, only what it hits matters.

| Code | Drawn? | Hit by a raycast? | Still in the scene? |
| --- | --- | --- | --- |
| `part.visible = false` | No, and nothing under it is | Yes | Yes |
| `part.removeFromParent()` | No | Not by a raycast over the scene | No, but it still exists |
| `part.layers.set(1)` | Only by cameras with layer 1 on | Only by raycasters with layer 1 on | Yes |

**Analogy: a shop window.** Switching off the light on a display (`visible = false`) hides the item, but it's still in the window, and a customer reaching in still bumps into it. Taking it to the stockroom (`remove`) takes it out of the window, though it still exists. Layers are separate windows: each camera looks through the ones it's been told to.

### Layers test each object on its own

Every object is on layer 0 by default, and so is every camera and every raycaster; there are 32 layers. A camera draws an object when they share at least one layer. But unlike `visible`, the test is made on each object by itself: putting a Group on layer 1 does nothing for the Meshes inside it, which are still on layer 0. To move a whole part, set the layer on everything under it:

```js
part.traverse((object) => object.layers.set(1));
```

A scanner shoots a fixed ray through the rack's upright tube. Try each way of making the tube disappear, and watch both what's drawn and what the ray hits.

<div data-scene="hideTube"></div>

## B · Working knowledge

### Hiding a part

`visible = false` is the quick switch: nothing is rebuilt, and `visible = true` brings it straight back. A hidden part is still in the scene, so it still has its matrices refreshed every render, still counts in `Box3.setFromObject` (the world-space bounds page), and is still hit by raycasts. Removing it avoids all three; neither frees any memory, which is the disposal ownership page's job.

### Keeping picks off hidden parts

A raycast doesn't check `visible`, so filter the hits yourself. Checking `hit.object.visible` isn't enough: the Meshes under a hidden part still say `true`, as on the traverse variants page. Check every parent too:

```js
const isShown = (object) => {
  for (let current = object; current; current = current.parent) if (!current.visible) return false;
  return true;
};
const hits = raycaster.intersectObject(model).filter((hit) => isShown(hit.object));
```

### Layers for helpers and second views

```js
helper.layers.set(1);
camera.layers.enable(1); // draws layers 0 and 1; raycasters test layer 0 only, so clicks skip the helper

measureLines.traverse((object) => object.layers.set(2));
plannerCamera.layers.enable(2); // only the planner's camera shows the lines
```

`layers.set(n)` puts an object on layer `n` only; `enable(n)` adds a layer and keeps the others; `camera.layers.enableAll()` turns on all 32.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
