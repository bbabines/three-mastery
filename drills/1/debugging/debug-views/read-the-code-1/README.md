---
id: 1.debugging.debug-views.read-the-code.1
loop: 1
tier: light
concepts: [debugging.debug-views]
mode: read-the-code
context: debugging.debug-views/normal-problems
lenses: []
misconceptions:
  - debugging.debug-views/normals-lighting
---

# Debug views

> **In short:** Draw one hidden ingredient of the picture at a time, like triangles, normals, depth, or UVs, to see which one is wrong.
>
> **Used for:** Spotting flipped normals, finding stretched textures and seams, checking triangle layout, and tuning near and far.

## A · The basics

### One shape, four pictures

A lit, textured surface mixes many things into one color: the light, the normals, the texture, the UVs. When it looks wrong, you can't tell which from the final picture. A **debug view** draws just one of them:

| Code | Shows |
| --- | --- |
| `material.wireframe = true` | Every triangle's edges |
| `new MeshNormalMaterial()` | Which way each point faces, as a color |
| `new MeshDepthMaterial()` | Distance from the camera: white near, black far |
| `material.map = checker` | How the texture is laid over the surface |

**Analogy: a doctor's scans.** An X-ray shows the bones and an ultrasound the soft tissue: one body, and each picture answers one question.

### Bad normals show as color, not just as lighting

A normal problem under the lights looks like a shading problem: a dark patch that could pass for a shadow. `MeshNormalMaterial` ignores lights and turns each normal into a color, X into red, Y into green, Z into blue. Those directions are measured from the camera, so a surface facing you is blue-violet and the colors change as you orbit. A normal pointing the wrong way shows in the wrong color, however it's lit.

The tank has a patch of flipped normals. Compare the lit view with the normal view, orbit, then try the others.

<div data-scene="views"></div>

## B · Working knowledge

### Switching a view on and off

```js
scene.overrideMaterial = new MeshNormalMaterial(); // every mesh at once
scene.overrideMaterial = null;                     // and back
```

`wireframe` is a setting on the material, so every mesh that shares the material shows it.

### Normal problems

Flipped normals show as a patch in the colors of a surface facing away. A hard edge smoothed over shows as a gradient across a corner that should change color sharply. To see each normal as a line instead, use `VertexNormalsHelper`.

### UV stretching

A checker drawn in code needs no image file:

```js
const checker = new CanvasTexture(canvas); // canvas: squares drawn with a 2D context
checker.colorSpace = SRGBColorSpace;
material.map = checker;
```

The squares should come out square and the same size everywhere. Wide or tall rectangles mean the UVs stretch the texture there; a jump in the pattern is a seam.

### Depth issues

`MeshDepthMaterial` shades by the same depth the depth buffer stores, and most of that range is used up close to the camera. With `near` at 0.1, anything a few units away comes out nearly black. Raise `near` and the shades spread out; a view that's still all black or all white says `near` and `far` don't suit the scene.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
