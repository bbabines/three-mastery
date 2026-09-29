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

> **In short:** Hover and selection are two separate states, so each part's look is worked out from both, and put back exactly as it was when the part leaves them.
>
> **Used for:** Lighting up the part under the mouse in a configurator; picking several parts with Shift-click in an editor; clearing the selection with a click on empty space; and showing a tooltip over a room in a floor plan.

## A · The basics

### Two questions, two answers

"Is the pointer over it?" changes with every pointer move. "Did the user pick it?" changes only on a click, as the click vs drag page defined it. A part can be hovered, selected, both, or neither, so the code needs two separate records: one `hovered` part, and the `selected` parts.

With a single variable for both, the two fight. Click the crate and it looks selected; move the pointer off it, and the code that ends the hover puts the crate back to normal and forgets it, so the selection is gone.

Each part's look is worked out from both states every time either one changes: selected wins, then hovered, then the part's own look. And "its own look" has to be saved before the first change, so it can be put back exactly.

**Analogy: a finger and a sticky note.** Running your finger along a list shows where you're reading; a sticky note marks the line you chose. Lifting your finger shouldn't peel off the note.

Put the pointer over a part with the sliders or the mouse, click it (or press "Click at the pointer"), then move the pointer away. With one flag the selection vanishes; with two states it stays.

<div data-scene="states"></div>

## B · Working knowledge

### The states and the look

```js
let hovered = null;
const selected = new Set();

function refresh(part) {
  const look = selected.has(part) ? SELECTED : part === hovered ? HOVERED : part.userData.baseEmissive;
  part.material.emissive.copy(look);
}
```

- **Save the original first:** `part.userData.baseEmissive = part.material.emissive.clone()` when the part is loaded. Setting it back to black instead turns off a part that was meant to glow, like a screen or a lamp.
- **Refresh both parts on a hover change,** the one the pointer left and the one it entered.
- **Shared materials light up together.** Parts loaded from one glTF file often share a material, so changing its `emissive` changes every part that uses it. Give a highlighted part its own material while it's highlighted; the material override and restore page in the scene graph domain covers the swap.

### Clicks: add, toggle, clear

```js
function onClick(part, event) {
  if (!part) selected.clear();            // a click on empty space clears the selection
  else if (event.shiftKey) selected.has(part) ? selected.delete(part) : selected.add(part);
  else { selected.clear(); selected.add(part); }
  // then refresh every part whose state changed
}
```

### Hover costs a raycast

Hover raycasts on pointer moves, and a mouse can send several moves per frame. Save the latest pointer spot in the `pointermove` handler and raycast once per frame from the frame loop. On a heavy model, raycast simple stand-in shapes instead of the detailed meshes. Touch screens have no hover: a finger only exists while it presses, so show on a tap what the mouse would show on hover. Change the cursor as a hint that something is clickable: `canvas.style.cursor = hovered ? 'pointer' : ''`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
