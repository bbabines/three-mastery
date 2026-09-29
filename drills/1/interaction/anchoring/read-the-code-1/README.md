---
id: 1.interaction.anchoring.read-the-code.1
loop: 1
tier: core
concepts: [interaction.anchoring]
mode: read-the-code
context: interaction.anchoring/hotspots
lenses: []
misconceptions:
  - interaction.anchoring/labels-hide
---

# 3D-to-2D anchoring

> **In short:** To pin an HTML label to a spot in the scene, project the spot to the screen every frame, then hide the label yourself when the spot is behind the camera, off the view, or behind something else.
>
> **Used for:** Hotspots that explain the parts of a product; price tags over items on a store shelf; labels showing a measured distance in a planning tool; and name tags over players in a game.

## A · The basics

### Project, place, and repeat every frame

The project and unproject page did the math: `anchor.getWorldPosition(v).project(camera)` turns a spot in the world into NDC, and the clip space, NDC, screen page turned NDC into CSS pixels. An **anchored label** is an HTML element over the canvas, moved to those pixels every frame, because the camera and the object keep moving. HTML gives crisp text at any zoom, CSS styling, and buttons that can be clicked.

### Nothing hides for you

Placing is the easy half. The label is just an element on top of the page, so it shows wherever it's put, and nothing about it knows what's in the scene:

- **Behind the camera,** `project` comes back with z above 1 and x and y flipped, so the label can land on screen, mirrored. The project and unproject page showed the check.
- **Off the view,** x or y is outside −1 to 1.
- **Behind another object,** `project` has no idea. The label shows right through the object. Only a raycast from the camera toward the anchor can tell, by finding something closer than the anchor.

**Analogy: player names on a sports broadcast.** The name tag isn't painted on the player; it's drawn over the picture and moved every frame to follow them. When the player runs behind the goal, somebody has to decide to hide the tag.

Turn the product. The serial plate is on its back, so from the front the product hides it. Checking the view alone, its label still shows, right through the product. The raycast hides it.

<div data-scene="pin"></div>

## B · Working knowledge

### Pinning a label

```js
const ndc = anchor.getWorldPosition(v).project(camera);
label.style.transform = `translate(${(ndc.x + 1) / 2 * canvas.clientWidth}px, ${(1 - ndc.y) / 2 * canvas.clientHeight}px)`;
label.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;
```

Place labels after the camera has moved for this frame: after `controls.update()` and the render, or call `camera.updateMatrixWorld()` first. `project` uses the camera's saved matrices, so labels placed before the camera moves trail a frame behind the view and wobble while it orbits.

### Hiding labels behind things

```js
dir.copy(anchorPos).sub(camera.position).normalize();
raycaster.set(camera.position, dir);
const first = raycaster.intersectObjects(blockers)[0];
const blocked = first !== undefined && first.distance < camera.position.distanceTo(anchorPos) - 0.01;
```

- **Allow a little room.** An anchor exactly on a surface is hit by that surface at almost exactly its own distance, and rounding decides which comes first: in a test of 2,000 views for this page, the surface hid its own anchor about one time in four. Lift anchors slightly off the surface, or subtract a small amount as above.
- **Raycast a list of blockers,** the meshes that can hide labels, not the whole scene with its helpers.
- **Cost:** one raycast per label. With many labels, check a few each frame, or only once the camera stops, and test simple stand-in shapes. Projecting and moving the elements is cheap by comparison.

### CSS2DRenderer does the placing

```js
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height); // the canvas's CSS size, again on every resize
labelRenderer.domElement.style.cssText = 'position: absolute; top: 0; pointer-events: none;';
container.append(labelRenderer.domElement);
product.add(new CSS2DObject(tagElement)); // rides along with the product
labelRenderer.render(scene, camera);      // every frame, after renderer.render
```

- **It hides some labels for you:** anchors whose projected z is outside −1 to 1 (behind the camera or past `far`), objects that are hidden or under a hidden parent, and objects on a layer the camera doesn't see.
- **It doesn't hide labels behind other objects.** Raycast, then set the label object's `visible = false`, and it hides it.
- Its layer covers the canvas, so give it `pointer-events: none`, as on the controls coexistence page.

Walk forward. The exit sign's anchor passes behind the camera and `CSS2DRenderer` hides its label. The rack's label shows through the wall until the raycast joins in.

<div data-scene="css2d"></div>

### Which space is it in?

This page works from **the world**, through **NDC**, to **screen pixels**.

| Value | Space |
| --- | --- |
| `anchor.getWorldPosition(v)`, `anchorPos` | The world |
| What `project(camera)` gives back | NDC: z above 1 behind the camera |
| The label's `translate(...)` | CSS pixels from the canvas's top-left corner |
| `first.distance`, `camera.position.distanceTo(anchorPos)` | World units along the ray from the camera |
| A `CSS2DObject`'s `position` | Measured from its parent, like any object |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
