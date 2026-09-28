---
id: 1.math.angle-between.read-the-code.1
loop: 1
tier: core
concepts: [math.angle-between]
mode: read-the-code
context: math.angle-between/turn-direction
lenses: []
misconceptions:
  - math.angle-between/angleto-direction
---

# Angle between and signed angle

> **In short:** `angleTo` says how far apart two directions are; a signed angle also says which way to turn.
>
> **Used for:** Turning toward a target, dials and knobs, compass headings, and showing angles to people.

## A · The basics

### How far apart are two directions?

`a.angleTo(b)` gives the angle between two directions. It runs from 0, pointing the same way, to half a turn, pointing opposite ways.

three.js measures angles in **radians**, not degrees. Half a turn is π radians, about 3.14, so a right angle is about 1.57. Convert when you need degrees:

```js
MathUtils.radToDeg(angle); // radians to degrees
MathUtils.degToRad(90);    // degrees to radians
```

### Which way to turn?

`angleTo` never says which side. A target 45° to your left and one 45° to your right both give the same angle.

To know which way to turn, you need a **signed angle**: positive for one way and negative for the other. That only makes sense once you pick an "up" to turn around, the way a steering wheel turns around its column.

**Analogy: a steering wheel.** "Turn 45°" isn't enough to drive by; you also need "left" or "right." `angleTo` gives the amount, and the signed angle adds the side.

Move the target around the turret:

<div data-scene="turn"></div>

## B · Working knowledge

### The signed angle recipe

This combines the dot product and cross product pages. The cross product's up part says which side the target is on, the dot product says whether it's ahead or behind, and `Math.atan2` turns the pair into an angle from −180° to 180°:

```js
const toTarget = target.position.clone().sub(turret.position);
const cross = new Vector3().crossVectors(forward, toTarget);
const signed = Math.atan2(cross.dot(up), forward.dot(toTarget));
// With Y up: positive means turn left, negative means turn right.
```

If you only need left or right, the sign of the cross product's up part is enough: `cross.y > 0` means left.

### Radians catch everyone

Every three.js rotation is in radians. `mesh.rotation.y = 90` doesn't make a quarter turn: it turns 90 radians, over 14 full turns, and lands somewhere unexpected. Compare:

<div data-scene="radians"></div>

The same goes for `Math.sin` and `Math.cos`. When you show an angle to a person, convert it to degrees first.

### Turning a dial

A knob you drag around its center uses the signed angle between where the drag started and where the pointer is now. The sign says which way to turn the knob, and the size says how far.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
