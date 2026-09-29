---
id: transforms.add-vs-attach
name: add vs attach
domain: transforms
tier: light
prerequisites: [transforms.local-vs-world]
misconceptions:
  reparent-no-move: '"Reparenting never moves anything."'
contexts:
  pick-up: Picking up an object
  group-selection: Grouping a selection
  onto-rack: Moving a part onto a rack
---

## Definition

`add` gives an object a new parent and keeps its position, rotation, and scale numbers, so it can jump; `attach` gives it a new parent and changes those numbers so it stays where it was in the world.

## Space lens

After `add`, the same numbers are measured from the new parent, so the world spot changes. After `attach`, the world spot, facing, and size stay the same, and the numbers change to match.
