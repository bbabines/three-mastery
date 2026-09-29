---
id: 1.math.length.read-the-code.1
loop: 1
tier: light
concepts: [math.length]
mode: read-the-code
context: math.length/nearest-object
lenses: []
misconceptions:
  - math.length/needs-real-length
---

# Length and lengthSq

> **In short:** How far a vector reaches in a straight line; lengthSq is a quicker version that works just as well for comparing lengths with each other.
>
> **Used for:** Distances between objects, finding the nearest one, "is it within range?" checks, and capping a speed.

## A · The basics

### How long is a move?

A move like (3, 0, −4) goes 3 to the right and 4 away from you. Its **length** is how far that is in a straight line: 5. In three.js:

```js
move.length(); // 5
```

The distance between two places is the length of the move between them, so three.js gives you a shortcut:

```js
a.distanceTo(b); // same as b.clone().sub(a).length()
```

**Analogy: as the crow flies.** Walk 3 blocks east and 4 blocks north and you've walked 7 blocks. A crow flying straight there covers only 5. Length is the crow's distance.

Move B around with the sliders. The gray lines are the blocks; the green line is the length.

<div data-scene="distance"></div>

<details>
<summary>The math, if you're curious</summary>

Length is the square root of x² + y² + z². For (3, 0, −4), that's √(9 + 0 + 16) = √25 = 5. three.js does this for you.

</details>

## B · Working knowledge

### Comparing is cheaper than measuring

`lengthSq()` and `distanceToSquared()` give the length multiplied by itself. They skip a square root, the slowest step. When you only need to know which is closer, the squared version gives the same answer: if A is closer than B, A's squared distance is smaller too. Use it in loops over many objects.

To compare against a radius, square the radius too:

```js
if (player.position.distanceToSquared(coin.position) < radius * radius) collect(coin);
```

Comparing a squared distance to a plain radius is a common bug. The check silently uses the wrong circle: smaller than you meant for a radius over 1, bigger for a radius under 1.

### Changing a length

`setLength(n)` keeps the direction and changes the length. `clampLength(min, max)` keeps a length inside a range, which is how you cap a speed:

```js
velocity.clampLength(0, maxSpeed);
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
