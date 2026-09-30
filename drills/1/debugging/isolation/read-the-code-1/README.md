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

> **In short:** Ask the scene instead of the code: switch things off one at a time until a single change makes the bug disappear.
>
> **Used for:** Tracking down flicker, finding where a frame's work goes, one bad material among hundreds, and writing bug reports.

## A · The basics

### Ask the scene, not the code

A scene of 300 parts has a flicker somewhere. Reading the code until you spot the cause can take all day, and it only finds bugs you already know how to recognize. **Isolation** asks the scene instead: switch one thing off, look, and switch it back. Triage sorts a bug into a bucket; isolation finds the exact part, mesh, or setting inside it.

| Try | What it tells you |
| --- | --- |
| `part.visible = false` | Whether the bug lives in that part |
| `scene.overrideMaterial = new MeshNormalMaterial()` | Whether it's the materials or the shapes |
| Hide half, then half of what's left | Which of hundreds of parts it is |
| The suspect alone, in a new empty scene | Whether it's the part or the scene around it |

**Analogy: a string of old holiday lights with one dead bulb.** Nobody reads the wiring. You test half the string, then half of that half, and the dead bulb turns up in a few tries.

### Bisect: half at a time

**Bisecting** means hiding half the suspects and checking whether the bug is still there, then doing the same with whichever half has it. Each check halves what's left, so 300 parts take 9 checks.

One of the crates flickers. Narrow the range of crates shown until one is left, then give every mesh its own color.

<div data-scene="zFight"></div>

## B · Working knowledge

### One change at a time

Each check changes one thing, and you undo it before the next. Change the near plane, a material, and a part's visibility together, and when the bug goes away you can't tell which did it.

```js
const parts = rack.children;
parts.forEach((part, i) => (part.visible = i < parts.length / 2)); // the first half only
```

### A bad material

When one part looks wrong, give it a plain material. If the problem goes away, it's in the material's settings or textures; if not, it's in the shape or the lighting. Then put the real material back and remove one setting at a time:

```js
material.normalMap = null;
material.needsUpdate = true; // removing a texture changes the shader three.js builds
```

### A minimal repro

A **minimal repro** (short for reproduction) is the smallest scene that still shows the bug. If the valve still looks wrong on its own, the bug belongs to the valve; if it looks right, something around it did it. A repro small enough to paste is what a bug report needs.

```js
const test = new Scene();
test.add(new HemisphereLight(0xffffff, 0x444444, 2), valve.clone());
renderer.render(test, camera);
```

### A performance hotspot

Hide one group at a time and compare what `renderer.info` reports for the next render. Hiding frees no GPU memory; it only skips the drawing. The counts show where the work is, not whether it's what makes the frame slow. Switch each group off in turn and watch the triangle count.

<div data-scene="hotspot"></div>

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
