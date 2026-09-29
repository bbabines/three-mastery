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

> **In short:** The stencil buffer is a small number at every pixel that one draw can write and later draws can test, so you can mark some pixels and then draw only inside, or only outside, the mark.
>
> **Used for:** An outline around a selected product; a portal or window that shows a different scene through it; a mirror or a screen that only draws inside its frame; and capping a model that a clipping plane has cut open.

## A · The basics

### A third buffer, for marks

The pipeline stages page listed three things the framebuffer keeps for every pixel: a color, a depth, and a **stencil** value. The stencil value is a small whole number (WebGL asks for at least 8 bits, so 0 to 255), and it means whatever you decide. A draw can write a number into every pixel it covers; a later draw can be told "only where the number is 1" or "only where it isn't". The test runs next to the depth test, for every fragment.

three.js leaves the stencil buffer out unless you ask for it: `new WebGLRenderer({ stencil: true })`. The scenes on these pages create their renderer that way.

**Analogy: masking tape before painting.** Tape off the window frame, paint, and the paint lands everywhere except under the tape. The stencil buffer is the tape: one draw puts it down, and later draws paint around it or only inside it.

### An outline without post-processing

To outline a selected part, first draw the part and have it write 1 wherever it lands. Then draw a slightly bigger copy in the outline color, only where the stencil isn't 1. The copy is hidden everywhere the part is, so only its rim shows: an outline, for one extra draw call.

Try the three versions. Without the stencil, the bigger copy covers the part; with it, only the rim is left.

<div data-scene="outline"></div>

## B · Working knowledge

### The outline recipe

```js
const renderer = new WebGLRenderer({ antialias: true, stencil: true });

part.material.stencilWrite = true;                       // turn the stencil on for this material
part.material.stencilRef = 1;
part.material.stencilZPass = ReplaceStencilOp;           // write 1 where the part is drawn

const rim = new Mesh(part.geometry, new MeshBasicMaterial({ color: 'yellow' }));
rim.scale.setScalar(1.05);
rim.material.stencilWrite = true;
rim.material.stencilRef = 1;
rim.material.stencilFunc = NotEqualStencilFunc;          // draw only where it isn't 1
rim.renderOrder = 1;                                     // after the part
```

- **`stencilWrite` turns the stencil on for the material, reading included.** A material that only tests, like the rim, still needs `stencilWrite: true`, with the default `stencilZPass: KeepStencilOp` so it writes nothing.
- **Without `stencil: true` on the renderer, none of it does anything,** and there's no error. A render target needs `stencilBuffer: true` for the same reason.
- **Order matters:** the mark has to be written before the draw that tests it, so give the tester a higher `renderOrder`.
- Scaling a copy gives an even rim only on rounded, roughly convex shapes. Pushing the copy's vertices out along their normals works on any shape; that's a small vertex shader, which the extending materials page covers.

### Masks and portals

```js
// the opening: writes 1, but no color and no depth
opening.material = new MeshBasicMaterial({
  colorWrite: false, depthWrite: false,
  stencilWrite: true, stencilRef: 1, stencilZPass: ReplaceStencilOp,
});
opening.renderOrder = -1; // before everything else

// each material of the world behind it: drawn only where the stencil is 1
roomMaterial.stencilWrite = true;
roomMaterial.stencilRef = 1;
roomMaterial.stencilFunc = EqualStencilFunc;
```

### Other uses

- **Clipping caps:** three.js's clipping planes cut a mesh open. Counting the back and front faces behind the cut in the stencil shows where to draw a flat cap; three.js's "clipping stencil" example on threejs.org does this.
- **Post-processing outlines** exist too. The multi-pass page covers what they cost: `OutlinePass` renders the scene twice more and runs about eight full-screen passes.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
