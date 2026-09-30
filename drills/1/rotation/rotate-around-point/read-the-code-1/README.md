---
id: 1.rotation.rotate-around-point.read-the-code.1
loop: 1
tier: light
concepts: [rotation.rotate-around-point]
mode: read-the-code
context: rotation.rotate-around-point/orbit
lenses: []
misconceptions:
  - rotation.rotate-around-point/origin-rotation
---

# Rotating around a point

> **In short:** To turn something around a point, turn its offset from that point, then add the point back.
>
> **Used for:** Moons and cameras orbiting a planet, doors on hinges, spinning a product around its middle, and turning several parts together.

## A · The basics

### Every turn has a center

An object's `rotation` turns it around its own origin, unless its `pivot` is set. A vector turned with `applyAxisAngle` swings around (0, 0, 0) of the space it's measured in, which for a `position` is the parent's origin. So `moon.position.applyAxisAngle(up, angle)` swings the moon around the center of the scene, not around its planet.

### Move, turn, move back

To turn around another point, make that point the origin for a moment. A pivot group does this for an object that always turns around one spot; these steps turn any object around any point, like whichever part is selected.

```js
const offset = moon.position.clone().sub(planet.position); // from the planet to the moon
offset.applyAxisAngle(up, angle);                          // turn it around the planet
moon.position.copy(planet.position).add(offset);           // put the planet back on
moon.rotateOnWorldAxis(up, angle);                         // keep the same side facing in
```

To orbit, run these every frame with a small angle, like `speed * delta`. The last line turns the moon itself too, so it keeps showing the planet the same side. Leave it out for something that should stay level, like a gondola on a Ferris wheel.

**Analogy: a tetherball.** The ball swings around its pole wherever the pole stands, because the rope measures from the pole.

The planet sits away from the center of the scene. Try both buttons and turn: the moon either circles the planet or swings around the world's center and wanders off.

<div data-scene="orbit"></div>

## B · Working knowledge

### A hinge in one step

The same three steps pack into one matrix, read from the bottom up:

```js
const m = new Matrix4().makeTranslation(hinge)                      // 3. move back
  .multiply(new Matrix4().makeRotationY(angle))                     // 2. turn
  .multiply(new Matrix4().makeTranslation(hinge.clone().negate())); // 1. hinge to origin
door.applyMatrix4(m); // hinge is measured from the door's parent
```

Each call turns the door a little more. `applyMatrix4` doesn't allow for `pivot`, so an object with one set jumps.

### Spinning a product around its middle

```js
const center = new Box3().setFromObject(chair).getCenter(new Vector3()); // in the world
chair.position.sub(center).applyAxisAngle(up, angle).add(center);
chair.rotateOnWorldAxis(up, angle);
```

The box's center is in the world, which matches `position` only while the chair sits straight in the scene. Work out the center once, before turning, since the box changes shape as the chair turns.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
