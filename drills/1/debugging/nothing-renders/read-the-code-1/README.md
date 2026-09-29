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

> **In short:** When something doesn't show up, run the same seven checks in the same order instead of guessing: is it in the scene, between near and far, in view, a sensible size, facing the camera, lit, and free of NaN?
>
> **Used for:** A model that loaded without an error but isn't on screen; a shape built from your own vertex data; a black frame right after adding post-processing; and a label or marker that should be floating over a part.

## A · The basics

### Loaded isn't visible

A model is loaded when the loader's `onLoad` runs or its promise resolves (the load lifecycle page). That only says the file arrived and became three.js objects. It says nothing about whether those objects are in the scene, in front of the camera, or a size the camera can see.

**Analogy: a parcel signed for at the front desk.** It has arrived, but that doesn't put it on your desk, unpacked, the right way up.

### Seven checks, in order

The triage page sorted bugs into buckets. When the symptom is "nothing shows", the same seven checks cover almost every cause. Run them in order: the early ones are the cheapest, and each one assumes the ones before it passed.

| Check | How to answer it | Usual cause when it fails |
| --- | --- | --- |
| 1. In the scene? | Follow `object.parent` up: does it reach the scene? Is every parent `visible`? | `scene.add(gltf.scene)` left out, or added to a group that isn't in the scene |
| 2. Between near and far? | Its distance from the camera against `camera.near` and `camera.far` | `near` or `far` set in the wrong units |
| 3. In view? | `frustum.intersectsObject(mesh)`, as on the frustum page | It's behind the camera, or the camera looks somewhere else |
| 4. A sensible size? | `new Box3().setFromObject(object).getSize(v)` | Units: scaled down twice, it's a speck; in millimeters, it's so big the camera sits inside it |
| 5. Facing the camera? | Does `material.side = DoubleSide` bring it back? | A flat shape seen from behind, or corners listed the wrong way round |
| 6. Lit? | Does the material react to lights, and is there a light, or a `scene.environment`? | A lit material with no light draws black |
| 7. Free of NaN? | `object.matrixWorld.elements.some(Number.isNaN)` | Your own math divided by zero; the NaN and degenerate cases page, later in this domain |

Pick a bug. The readout runs the seven checks on the sign, live, with the three.js calls in the table, and stops at the first one that fails. Orbit behind the sign too.

<div data-scene="checklist"></div>

## B · Working knowledge

### An invisible loaded model

```js
const gltf = await loader.loadAsync('shelf.glb');
scene.add(gltf.scene);
console.log(new Box3().setFromObject(gltf.scene).getSize(new Vector3())); // (1800, 2000, 400)
```

A size in the thousands means the file is in millimeters: check 4. Scale it by 0.001, or frame the camera on it with the fit to bounds page. Loaded parts can also be hidden in the file itself: check `visible` and `layers` on every parent, as on the visibility, removal, layers page.

### Invisible custom geometry

Shapes built from your own arrays fail at checks 5 and 7 most often:

- **Corners listed clockwise** face away from the camera. The winding order page reverses them.
- **NaN in the positions** hides the shape. This is one of the few NaN cases three.js reports: the first render logs `THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN`, because culling needs the bounds.
- **Vertices moved after the first render** leave the saved bounds behind, so the shape can be culled while in view. The updating buffers page recomputes them.

### Black post-processing output

A composer only shows what its passes draw. Without a `RenderPass` first, nothing draws the scene into it, and the canvas is black. The multi-pass and post-processing page covers the order, `OutputPass` last included; the triage page's check, `renderer.render(scene, camera)` in place of `composer.render()`, proves the scene itself is fine.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
