---
id: 1.debugging.nothing-renders.read-the-code.1
loop: 1
tier: light
concepts: [debugging.nothing-renders]
mode: read-the-code
context: debugging.nothing-renders/invisible-model
lenses: []
misconceptions:
  - debugging.nothing-renders/loaded-visible
---

# Nothing-renders checklist

> **In short:** When something doesn't show, walk the same seven checks in the same order instead of guessing, cheapest first.
>
> **Used for:** A loaded model that isn't on screen, custom shapes that vanish, black post-processing, and missing labels.

## A · The basics

### Loaded isn't visible

A model is loaded when the loader's `onLoad` runs or its promise resolves. That only says the file arrived and became three.js objects, not that they're in the scene, in front of the camera, or a size the camera can see.

**Analogy: a parcel signed for at the front desk.** It has arrived, but that doesn't put it on your desk, unpacked, the right way up.

### Seven checks, in order

When the symptom is "nothing shows", the same seven checks cover almost every cause. Run them in order: the early ones are the cheapest, and each one assumes the ones before it passed.

| Check | How to answer it |
| --- | --- |
| 1. In the scene? | Follow `object.parent` up to the scene, every parent `visible` |
| 2. Between near and far? | Its distance from the camera, against `near` and `far` |
| 3. In view? | `frustum.intersectsObject(mesh)` |
| 4. A sensible size? | `new Box3().setFromObject(object).getSize(v)` |
| 5. Facing the camera? | Does `material.side = DoubleSide` bring it back? |
| 6. Lit? | A lit material needs a light, or a `scene.environment` |
| 7. Free of NaN? | `object.matrixWorld.elements.some(Number.isNaN)` |

Pick a bug, and orbit behind the sign too. The readout stops at the first check that fails.

<div data-scene="checklist"></div>

## B · Working knowledge

### An invisible loaded model

```js
const gltf = await loader.loadAsync('shelf.glb');
scene.add(gltf.scene);
console.log(new Box3().setFromObject(gltf.scene).getSize(new Vector3())); // (1800, 2000, 400)
```

A size in the thousands means the file is in millimeters: check 4. Scale it by 0.001. Parts can also be hidden in the file itself, so check `visible` and `layers` on every parent.

### Invisible custom geometry

Shapes built from your own arrays fail checks 5 and 7 most often. Corners listed clockwise face away from the camera. NaN in the positions is one of the few NaN cases three.js reports, on the first render, because culling needs the bounds:

```
THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN
```

Vertices moved after the first render leave the saved bounds behind, so the shape can be culled while in view. Recompute the bounds after moving them.

### Black post-processing output

A composer only shows what its passes draw. Without a `RenderPass` first, nothing draws the scene into it, and the canvas is black:

```js
composer.addPass(new RenderPass(scene, camera)); // first
composer.addPass(new OutputPass());              // last
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
