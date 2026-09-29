---
id: 1.optimization.render-on-demand.read-the-code.1
loop: 1
tier: light
concepts: [optimization.render-on-demand]
mode: read-the-code
context: optimization.render-on-demand/static-viewer
lenses: []
misconceptions:
  - optimization.render-on-demand/continuous-required
---

# Render on demand

> **In short:** Render on demand draws a new frame only when something has changed, like the camera moving or a finish being picked, instead of redrawing the same picture at every screen refresh.
>
> **Used for:** A product viewer that sits still while the shopper reads the specs; a floor plan or dashboard left open all day on a laptop running on battery; a 3D figure in the middle of a long article; and letting a phone cool down between interactions.

## A · The basics

### Most frames draw the same picture

`renderer.setAnimationLoop` calls your frame at every screen refresh, 60 or more times a second (the frame budget page), and a frame that calls `render()` draws everything again: the same draw calls and the same pixel work. When nothing has moved, it draws exactly the picture already on screen.

Continuous rendering is only needed while something animates. A product viewer, a floor plan, or a chart is still most of the time. It changes when the user orbits, picks an option, or resizes the window. Rendering on demand draws a frame then, and otherwise draws nothing.

**Analogy: a motion-sensor light.** A hallway light on a sensor comes on when someone walks through and goes off when the hall is empty. A light left on all night lights the same empty hall.

This scene, like every scene on these pages, renders every frame. The readout counts those frames, and the frames an on-demand viewer would have drawn: one for each frame where OrbitControls reported a `change` or a finish button changed the color. Orbit, let go, and watch the counts. With damping on, the camera glides for a moment after you let go, and those frames count too.

<div data-scene="demand"></div>

## B · Working knowledge

### Rendering when something changes

```js
let needsRender = true;
controls.addEventListener('change', () => (needsRender = true));

renderer.setAnimationLoop(() => {
  controls.update(); // with damping, the glide happens here, and it fires 'change'
  if (!needsRender) return;
  needsRender = false;
  renderer.render(scene, camera);
});
```

- **Keep the loop, skip the render.** With `enableDamping`, the camera glides inside `controls.update()` (the controls tour), so something has to keep calling it. Without damping, `controls.addEventListener('change', render)` and no loop at all is enough.
- **Anything else that changes the picture sets `needsRender = true`:** a color or material change, a part shown or hidden, a model or texture finishing loading, and a resize, after `setSize` and `updateProjectionMatrix` (the aspect and resize page). Forget one, and the screen shows the old picture until the next orbit.
- **Animations** need every frame while they play, so set the flag each frame until they end.

### Background tabs

MDN notes that browsers pause `requestAnimationFrame`, which `setAnimationLoop` runs on, in background tabs and hidden iframes. A hidden tab stops rendering either way. Rendering on demand is for the visible page that isn't changing.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
