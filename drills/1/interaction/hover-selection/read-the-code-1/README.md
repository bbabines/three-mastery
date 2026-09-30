---
id: 1.interaction.hover-selection.read-the-code.1
loop: 1
tier: light
concepts: [interaction.hover-selection]
mode: read-the-code
context: interaction.hover-selection/part-highlight
lenses: []
misconceptions:
  - interaction.hover-selection/one-flag
---

# Hover and selection state

> **In short:** Keep "the pointer is over it" and "the user picked it" as two records, and work out each part's look from both.
>
> **Used for:** Highlighting parts in a configurator, Shift-click multi-select, deselecting on an empty click, and floor-plan tooltips.

## A · The basics

### Two questions, two answers

"Is the pointer over it?" changes with every pointer move. "Did the user pick it?" changes only on a click. A part can be hovered, selected, both, or neither, so the code keeps two records:

```js
let hovered = null;         // the one part under the pointer
const selected = new Set(); // the parts the user picked
```

With one variable for both, they fight. Click the crate, move the pointer off it, and the code that ends the hover puts the crate back to normal and forgets it.

Whenever either record changes, each part's look is worked out from both: selected wins, then hovered, then the part's own look. That own look is saved before the first change, so it can be put back exactly.

**Analogy: a finger and a sticky note.** Running your finger down a list shows where you're reading, and a sticky note marks the line you chose. Lifting your finger shouldn't peel off the note.

Point at a part, click it (or press "Click at the pointer"), then move away. With one flag the selection vanishes; with two states it stays.

<div data-scene="states"></div>

## B · Working knowledge

### Working out a part's look

```js
function refresh(part) {
  const look = selected.has(part) ? SELECTED : part === hovered ? HOVERED : part.userData.baseEmissive;
  part.material.emissive.copy(look);
}
```

Save `part.userData.baseEmissive = part.material.emissive.clone()` when the part loads, since setting it back to black turns off a part meant to glow, like a screen. On a hover change, refresh both the part the pointer left and the one it entered.

Parts loaded from one glTF file often share a material, so changing its `emissive` lights them all. Give a highlighted part its own material while it's highlighted, as the material override page shows.

### Clicks: add, toggle, clear

```js
if (!part) selected.clear(); // a click on empty space
else if (event.shiftKey) selected.has(part) ? selected.delete(part) : selected.add(part);
else { selected.clear(); selected.add(part); }
```

Then refresh every part whose state changed.

### Hover costs a raycast

A mouse can send several moves in one frame, so save the latest pointer spot in `pointermove` and raycast once per frame. Touch screens have no hover, so show on a tap what the mouse would show on hover.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
