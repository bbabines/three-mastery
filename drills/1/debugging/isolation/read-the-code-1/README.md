---
id: 1.debugging.isolation.read-the-code.1
loop: 1
tier: core
concepts: [debugging.isolation]
mode: read-the-code
context: debugging.isolation/z-fighting
lenses: []
misconceptions:
  - debugging.isolation/read-until
---

# Isolation

> **In short:** Instead of reading code until the bug jumps out, change what the scene draws one thing at a time, hiding parts, swapping materials, cutting the scene in half, until a single change turns the bug on or off, which points straight at its cause.
>
> **Used for:** Finding which two surfaces flicker through each other; finding the one model that weighs a scene down; finding which material renders wrong in a scene of hundreds; and cutting a bug down to a few lines to post on a forum or in a bug report.

## A · The basics

### Ask the scene, not the code

A scene of 300 parts, 40 materials, and a few thousand lines of code has a flicker somewhere. Reading the code until you spot the cause can take all day, and it only finds bugs you already know how to recognize. **Isolation** asks the scene instead: switch one thing off, look, and switch it back. The triage page sorted a bug into a bucket; isolation finds the exact part, mesh, or setting inside it.

| Tool | Code | What it tells you |
| --- | --- | --- |
| Hide a part | `part.visible = false` | Whether the bug lives in that part |
| Layers | `part.traverse((o) => o.layers.set(1))` | The same, for one camera at a time (the visibility, removal, layers page) |
| Override materials | `scene.overrideMaterial = new MeshNormalMaterial()` | Whether it's the materials or the shapes (the material override and restore page) |
| Bisect | Hide half, then half of what's left | Which of hundreds of parts, in a handful of steps |
| Minimal repro | The suspect alone, in a new empty scene | Whether the bug belongs to the part or to the scene around it |

**Analogy: a string of old holiday lights with one dead bulb.** Nobody reads the wiring. You test half the string, then half of that half, and the dead bulb turns up in a few tries.

### Bisect: half at a time

**Bisecting** means hiding half the suspects and checking whether the bug is still there, then doing the same with whichever half has it. Each check halves what's left: 8 parts take 3 checks, 300 take 9.

One of the crates flickers where two surfaces sit at exactly the same depth. Narrow the range of parts shown until one crate is left, then give every mesh its own color.

<div data-scene="zFight"></div>

## B · Working knowledge

### One change at a time

Each check changes one thing, and you undo it before the next. Change the near plane, a material, and a part's visibility together, and when the bug goes away you can't tell which did it.

```js
const parts = rack.children;
parts.forEach((part, i) => (part.visible = i < parts.length / 2)); // the first half only
```

Keep whichever half still shows the bug, and split it again. Once it's down to one part, the fixes live on other pages: z-fighting on the depth precision page, a wrong shape in the geometry domain.

### A bad material

When one part looks wrong, give it a plain material. If the problem goes away, it's in the material's settings or its textures; if not, it's in the shape or the lighting. Then put the real material back and turn off one setting at a time, `material.map = null`, `material.normalMap = null`, and so on, with `material.needsUpdate = true` after each, since removing a texture changes the shader three.js builds.

### A minimal repro

```js
const test = new Scene();
test.add(new HemisphereLight(0xffffff, 0x444444, 2), valve.clone());
renderer.render(test, camera);
```

A **minimal repro** (short for reproduction) is the smallest scene that still shows the bug. If the valve still looks wrong on its own, the bug belongs to the valve. If it looks right, something around it did it: the lights, the environment, post-processing, or another object. A repro small enough to paste is what a forum question or a bug report needs.

### A performance hotspot

The same tools find cost. Hide one group at a time and compare what `renderer.info` reports for the next render. Hiding costs nothing and frees no GPU memory; it only skips the drawing. Counts show where the work is, not whether it's what makes the frame slow: measuring that is the measurement tools page, in the GPU pipeline domain.

<div data-scene="hotspot"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
