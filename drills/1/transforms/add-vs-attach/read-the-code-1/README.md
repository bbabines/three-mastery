---
id: 1.transforms.add-vs-attach.read-the-code.1
loop: 1
tier: light
concepts: [transforms.add-vs-attach]
mode: read-the-code
context: transforms.add-vs-attach/onto-rack
lenses: []
misconceptions:
  - transforms.add-vs-attach/reparent-no-move
---

# add vs attach

> **In short:** Both give an object a new parent; `add` keeps its position numbers, so it can jump somewhere else, while `attach` keeps it right where it is.
>
> **Used for:** A game character picking up and dropping items, grouping a selection in an editor so it moves as one, docking a part onto a rack or a vehicle, and parenting a camera to something that moves without the view jumping.

## A · The basics

### Giving an object a new parent

From the local vs world page: a child's `position`, `rotation`, and `scale` are measured from its parent. An object has at most one parent, and giving it a new one is called **reparenting**. three.js has two methods for it, `add` and `attach`. Both take the object off its old parent first, so you never need to call `remove` before either one.

### add keeps the numbers

`rack.add(part)` keeps the part's `position`, `rotation`, and `scale` exactly as they were. But those numbers are now measured from the rack, so the same numbers point somewhere else: the part jumps. It also turns with the rack and grows or shrinks with it.

### attach keeps the spot

`rack.attach(part)` keeps the part where it is in the world: same spot, same facing, same size. To do that, three.js works out new `position`, `rotation`, and `scale` numbers that, measured from the rack, land in the same place.

**Analogy: directions from a landmark.** "Two blocks north of the library" leads to one door. Keep the words but swap the library for the train station, and they lead somewhere else. That's `add`. `attach` rewrites the directions so they still lead to the same door.

Try each button. The faint box marks where the part started. Then move the rack: after either `add` or `attach`, the part rides along, because it's the rack's child either way.

<div data-scene="rack"></div>

### Why it's easy to miss

`add` only leaves an object in place when the old parent and the new one sit at the same spot, face the same way, and are the same size. The common case is moving something from the scene into a fresh `Group` that hasn't been moved. That's why reparenting seems harmless, until one of the parents has been moved, turned, or resized.

## B · Working knowledge

### Picking up and putting down

To pick something up without it snapping into the hand, and to put it down where the hand let go:

```js
hand.attach(cup);  // stays where it was, then moves with the hand
scene.attach(cup); // stays where the hand left it
```

`scene.add(cup)` for the put-down would keep the cup's small offset from the hand and read it from the center of the scene, so the cup lands near (0, 0, 0).

### Grouping a selection

To move or turn several things as one, put them in a group. The selected things may sit inside other groups, like bins on different shelves, so use `attach` to keep each one in place:

```js
const selection = new Group();
scene.add(selection);
for (const item of selected) selection.attach(item);
```

To turn the group around the middle of the selection instead of the world's center, place the group there first; the pivots and offset groups page covers that.

### Snapping into a slot

When you're about to set the numbers yourself, `add` is the right one. The numbers you set are measured from the rack, so they mean the same slot wherever the rack stands:

```js
rack.add(part);
part.position.set(0, 1.2, 0); // shelf 2, measured from the rack
part.rotation.set(0, 0, 0);   // facing the same way as the rack
```

### What attach changes

- **All three values.** Under a rack turned 35°, the part's `rotation.y` becomes −35° so it keeps facing the same way. Under a rack model scaled to 0.01 because it was made in centimeters, the part's `scale` becomes 100 so it keeps its size.
- **It's right straight away.** `attach` works out both parents' world spots itself, so it's correct even if you moved a parent a line earlier.
- **It can't keep an object exactly in place under an unevenly stretched parent,** like a scale of (2, 1, 1). three.js's own docs say `attach` doesn't support that; the TRS order page shows why.

### Which space is it in?

| Value | Space |
| --- | --- |
| `part.position`, `.rotation`, `.scale` after `add` | Measured from the new parent: the old numbers, now read from a different place |
| `part.position`, `.rotation`, `.scale` after `attach` | Measured from the new parent: new numbers that land in the old spot |
| What `part.getWorldPosition(v)` gives back | The world: it changes after `add` and stays the same after `attach` |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
