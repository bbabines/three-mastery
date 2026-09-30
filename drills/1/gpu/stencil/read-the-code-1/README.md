---
id: 1.gpu.stencil.read-the-code.1
loop: 1
tier: light
concepts: [gpu.stencil]
mode: read-the-code
context: gpu.stencil/outlines
lenses: []
misconceptions:
  - gpu.stencil/outlines-need-post
---

# Stencil buffer

> **In short:** A small number at every pixel lets one draw mark some pixels, and later draws stay inside or outside the mark.
>
> **Used for:** Outlines on selected products, portals and windows into another scene, mirrors that stay in their frame, and clipping caps.

## A · The basics

### A third buffer, for marks

Besides a color and a depth, the picture can keep a **stencil** value at every pixel: a small whole number that means whatever you decide. A draw can write a number wherever it lands, and a later draw can be told "only where it's 1" or "only where it isn't". three.js leaves the stencil buffer out unless the renderer is created with `stencil: true`.

**Analogy: masking tape.** Tape off the window frame, paint, and the paint lands everywhere except under the tape. One draw puts the tape down, and later draws paint around it or only inside it.

### An outline without post-processing

Draw the selected part and have it write 1 wherever it lands. Then draw a slightly bigger copy in the outline color, only where the stencil isn't 1. Only its rim shows: an outline, for one extra draw call. A post-processing outline costs several full-screen passes, as the multi-pass page shows.

Try the three versions, and watch the draw calls.

<div data-scene="outline"></div>

## B · Working knowledge

### Marking the part

```js
const renderer = new WebGLRenderer({ antialias: true, stencil: true });
part.material.stencilWrite = true;
part.material.stencilRef = 1;
part.material.stencilZPass = ReplaceStencilOp; // write 1 where the part is drawn
```

Without `stencil: true` on the renderer, none of the stencil settings do anything, and there's no error.

### Drawing the rim

```js
rim.material.stencilWrite = true;
rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc; // draw only where it isn't 1
rim.renderOrder = 1;                            // after the part
```

The rim is a copy of the part, scaled up a little, in the outline color. `stencilWrite` switches the stencil on for a material, the test as well as the writing, so the rim needs it too; its default `stencilZPass`, `KeepStencilOp`, writes nothing.

### Masks, portals, and caps

For a portal, flip it around. The opening writes 1 with `colorWrite` and `depthWrite` off and a low `renderOrder`, and each material of the world behind it tests with `EqualStencilFunc`, so it draws only inside the opening. Clipping caps work the same way: the stencil marks where a clipping plane has cut a mesh open, and a flat cap is drawn only there.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
