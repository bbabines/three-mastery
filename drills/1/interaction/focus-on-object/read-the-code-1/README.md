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

> **In short:** To focus on a part, work out a view that fits its bounding sphere, then move the camera and the orbit target there together, so the camera ends up looking at the part and orbits around it afterward.
>
> **Used for:** Double-clicking a part to zoom in on it in a configurator; a "reset view" button; stepping through guided views in assembly instructions; and jumping to a search result in a big warehouse model.

## A · The basics

### The target decides where the camera looks

With `OrbitControls`, the camera doesn't choose where it looks: every update turns it toward `controls.target`, as the controls tour said. So a focus has two things to move, the camera's position and the target. The fit to bounds page works out both ends: the target goes to the center of the part's bounding sphere, and the camera backs off from there, along the way it already faces, until the sphere fits.

Move only the camera, and the next update turns it back toward the old target. The part slides off to the side, and the next orbit circles the old spot instead of the part.

**Analogy: a photographer changing subjects.** Walking up to the new subject isn't enough; they also have to turn toward it. The target is where the photographer faces.

### Move both, together

Blend both from where they are to where they're going with the same `t`, as on the lerp page, so the camera turns toward the part as it comes closer.

Slide `t` from 0 to 1, or double-click any part to focus on it. With the camera alone, the camera arrives in front of the part but keeps looking at the old target.

<div data-scene="focus"></div>

## B · Working knowledge

### The code

```js
const sphere = new Box3().setFromObject(part).getBoundingSphere(new Sphere());
const back = camera.getWorldDirection(new Vector3()).negate();
toTarget.copy(sphere.center);
toPosition.copy(sphere.center).addScaledVector(back, fitDistance(sphere)); // the fit to bounds page
fromTarget.copy(controls.target);
fromPosition.copy(camera.position);
elapsed = 0;

// every frame, until t reaches 1
elapsed += delta;
const t = MathUtils.clamp(elapsed / 0.8, 0, 1); // 0.8 seconds
camera.position.lerpVectors(fromPosition, toPosition, t);
controls.target.lerpVectors(fromTarget, toTarget, t);
```

- **Clamp `t`.** Past 1, `lerpVectors` keeps going, as on the lerp page, and the camera sails past the part.
- **Switch the orbit off during the move** with `controls.enabled = false`, or a drag partway through fights the animation.
- **Set `near` and `far` for the new distance,** as on the fit to bounds page, when the part is much smaller or bigger than the model.
- A straight line can pass through things on the way. For long moves, a common trick is to rise over an overview first.
- A plain `t` starts and stops abruptly. The interpolation toolbox page eases it, and the frame-rate-independent motion page shows the other common way to move: chase the goal a little every frame.

### Double-click, and back again

```js
canvas.addEventListener('dblclick', (event) => focusOn(partUnder(event)));
controls.saveState();                          // once, at startup
resetButton.addEventListener('click', () => controls.reset());
```

- A `dblclick` arrives after two `click`s, so a click handler that selects runs twice before it.
- `reset()` jumps straight back to the saved view. To glide home instead, animate to `controls.position0` and `controls.target0`, where `saveState()` keeps them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
