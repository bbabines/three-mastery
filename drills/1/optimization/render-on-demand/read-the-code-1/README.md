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

> **In short:** When nothing moves, don't redraw: render after each change and leave the last picture on screen.
>
> **Used for:** Product viewers, dashboards left open all day, 3D figures in long articles, and battery life on laptops.

## A · The basics

### Most frames draw the same picture

`renderer.setAnimationLoop` calls your frame at every screen refresh, 60 or more times a second, and each `render()` draws everything again. When nothing has moved, that's the picture already on screen, drawn again at full cost.

A product viewer or a floor plan is still most of the time. It changes when the user orbits, picks an option, or resizes the window. Rendering on demand draws a frame then, and otherwise draws nothing.

**Analogy: a motion-sensor light.** It comes on when someone walks through the hall and goes off when the hall is empty. A light left on all night lights the same empty hall.

Orbit, let go, and pick a finish, then compare the frames drawn with the ones an on-demand viewer would draw. With damping on, the glide after you let go counts too.

<div data-scene="demand"></div>

## B · Working knowledge

### Rendering when something changes

Set a flag whenever the picture changes:

```js
controls.addEventListener('change', () => (needsRender = true));
```

Then keep the loop, but skip the render while the flag is off:

```js
renderer.setAnimationLoop(() => {
  controls.update(); // with damping, the camera glides here and fires 'change'
  if (needsRender) render(); // draws the frame and sets needsRender = false
});
```

With damping, the camera keeps gliding inside `controls.update()` after the user lets go, so something has to keep calling it. Without damping, `controls.addEventListener('change', render)` and no loop at all is enough.

### Every change counts

A color change, a part shown or hidden, a model that finishes loading, and a resize all set `needsRender = true` too. Forget one, and the screen shows the old picture until the next orbit. An animation needs every frame while it plays.

### Background tabs

Browsers already pause the animation loop in a background tab, so a hidden tab stops rendering either way. Rendering on demand is for a visible page that isn't changing.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
