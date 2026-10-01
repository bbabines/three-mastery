---
id: 2.transforms.local-vs-world.implement.1
loop: 2
tier: core
concepts: [transforms.local-vs-world]
mode: implement
context: transforms.local-vs-world/nested-compare
lenses: [space]
misconceptions:
  - transforms.local-vs-world/position-is-world
---

# Local vs world: the nearest bin

> **The job:** measure the real gap between things that sit in different groups, and pick the bin nearest a robot.

## Task

A picking robot rides a cart down a warehouse aisle. The bins sit on shelves, the shelves on racks, and rack B can be turned to face the aisle at an angle. Write:

- `worldGap(a, b)`: how far apart `a` and `b` really are, in the world.
- `nearestBin(robot, bins)`: the number (index) of the bin in `bins` that's nearest the robot, in the world.

Each object's `position` is measured from its parent: the robot's from its cart, a bin's from its shelf. Something above them may have moved a line before your function runs, with no render since. Don't move anything.

Drive the cart and turn rack B. The yellow line runs from the robot to the bin `nearestBin` picks, and the white ring sits on the bin that really is nearest.

<div data-scene="aisle"></div>

## Spaces

| Value | Space |
| --- | --- |
| `robot.position` | Measured from its parent, the cart |
| A bin's `position` | Measured from its parent, a shelf |
| What `worldGap` returns | A distance in the world |

## Your code

Write it in `drills/2/transforms/local-vs-world/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/transforms/local-vs-world/implement-1
```

## The check

It passes when `worldGap` matches the distance between the two objects' spots in the world, `nearestBin` picks the bin nearest in the world even when a different one is nearest by its `position` numbers, both are right straight after a rack or the cart moves, and nothing gets moved.

<details>
<summary>Hint</summary>

The local vs world space page compares bins on two shelves. Of the ways to ask where something is, which one refreshes before it answers?

</details>

## Where else?

Where else do two positions need to be measured from the same place before you compare them?

<details>
<summary>A few answers</summary>

Aiming a spotlight at a part inside a group. A lamp riding on a moving arm that switches off near a wall. Sending a part's real spot to a server that knows nothing about its parents.

</details>
