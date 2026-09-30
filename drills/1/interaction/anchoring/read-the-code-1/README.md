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

> **In short:** An HTML label follows a spot in the scene by being moved there every frame, and hiding it is your job.
>
> **Used for:** Product hotspots, shelf price tags, measurement labels, and name tags over players.

## A · The basics

### Project, place, and repeat every frame

`anchor.getWorldPosition(v).project(camera)` turns a spot in the world into NDC, and from there into CSS pixels on the canvas. An **anchored label** is an HTML element over the canvas, moved to those pixels every frame as the camera and the object move. HTML gives crisp text, CSS styling, and buttons that can be clicked.

### Nothing hides for you

The label is just an element on top of the page, and nothing about it knows what's in the scene:

- Behind the camera, `project` gives a z above 1 and flips x and y, so the label can land on screen, mirrored.
- Off the view, x or y is outside −1 to 1.
- Behind another object, `project` has no idea. Only a raycast from the camera toward the anchor can tell.

**Analogy: player names on a sports broadcast.** The name tag isn't painted on the player; it's drawn over the picture and moved every frame to follow them. When the player runs behind the goal, somebody has to decide to hide the tag.

Turn the product with each button. The serial plate is on its back, and only the raycast hides its label from the front.

<div data-scene="pin"></div>

## B · Working knowledge

### Pinning a label

```js
const ndc = anchor.getWorldPosition(v).project(camera);
label.style.transform = `translate(${(ndc.x + 1) / 2 * canvas.clientWidth}px, ${(1 - ndc.y) / 2 * canvas.clientHeight}px)`;
label.hidden = Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1 || Math.abs(ndc.z) > 1;
```

Place labels after `controls.update()` and the render. `project` uses the camera's saved matrices, so labels placed before the camera moves trail a frame behind the view.

### Hiding labels behind things

```js
raycaster.set(camera.position, dir); // dir: toward the anchor, length 1
const first = raycaster.intersectObjects(blockers)[0];
const blocked = first !== undefined && first.distance < camera.position.distanceTo(anchorPos) - 0.01;
```

An anchor exactly on a surface is hit by that surface at almost its own distance, and rounding decides which comes first, so subtract a little, as above. Raycast a list of blockers, not the whole scene, and with many labels, check a few each frame.

### CSS2DRenderer does the placing

```js
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height);     // the canvas's CSS size, again on every resize
product.add(new CSS2DObject(tagElement)); // rides along with the product
labelRenderer.render(scene, camera);      // every frame, after renderer.render
```

Both come from `three/addons/renderers/CSS2DRenderer.js`. Append `labelRenderer.domElement` over the canvas with `pointer-events: none`. It hides labels whose anchor is behind the camera or past `far`, but not labels behind other objects: raycast, then set the label object's `visible = false`.

Walk forward with each button. The exit sign's label hides once it's behind the camera, but the rack's label shows through the wall until the raycast joins in.

<div data-scene="css2d"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
