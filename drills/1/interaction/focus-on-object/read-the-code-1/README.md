---
id: 1.interaction.focus-on-object.read-the-code.1
loop: 1
tier: light
concepts: [interaction.focus-on-object]
mode: read-the-code
context: interaction.focus-on-object/double-click-focus
lenses: []
misconceptions:
  - interaction.focus-on-object/leave-target
---

# Focus on object

> **In short:** Move the camera and the point it orbits together, so the part fills the view and later orbits stay on it.
>
> **Used for:** Double-click focus in a configurator, reset-view buttons, guided assembly steps, and jumping to search results.

## A · The basics

### The target decides where the camera looks

With OrbitControls, every update turns the camera toward `controls.target`. So a focus has two things to move: the camera's position and the target. The target goes to the center of the part's bounding sphere, and the camera backs off from there, along the way it already faces, until the sphere fits.

Move only the camera, and the next update turns it back toward the old target. The part slides off to the side, and the next orbit circles the old spot.

**Analogy: a photographer changing subjects.** Walking up to the new subject isn't enough; they also have to turn toward it. The target is where the photographer faces.

### Move both, together

Blend both from where they are to where they're going with the same `t`, so the camera turns toward the part as it comes closer.

Slide `t` from 0 to 1 with each button, or double-click a part to focus on it. With the camera alone, it arrives but keeps looking at the old target.

<div data-scene="focus"></div>

## B · Working knowledge

### Working out the end view

```js
const sphere = new Box3().setFromObject(part).getBoundingSphere(new Sphere());
const back = camera.getWorldDirection(new Vector3()).negate();
toTarget.copy(sphere.center);
toPosition.copy(sphere.center).addScaledVector(back, fitDistance(sphere));
```

`fitDistance` is the distance from the fit to bounds page. Save `controls.target` and `camera.position` as the start of the move.

### Moving there

```js
const t = MathUtils.clamp(elapsed / 0.8, 0, 1); // 0.8 seconds; elapsed grows by delta each frame
camera.position.lerpVectors(fromPosition, toPosition, t);
controls.target.lerpVectors(fromTarget, toTarget, t);
```

Clamp `t`, or the camera sails past the part once `t` goes over 1. Switch the orbit off during the move, or a drag partway through fights it. The interpolation toolbox page eases the start and stop.

### Double-click, and back again

```js
canvas.addEventListener('dblclick', (event) => focusOn(partUnder(event)));
controls.saveState();                          // once, at startup
resetButton.addEventListener('click', () => controls.reset());
```

A `dblclick` arrives after two `click`s, so a click handler that selects runs twice first. `reset()` jumps straight back. To glide home, animate to `controls.position0` and `controls.target0`, where `saveState()` keeps them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
