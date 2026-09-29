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

> **In short:** A debug view draws data you normally can't see as the picture itself: wireframe shows the triangles, `MeshNormalMaterial` colors each surface by the way it faces the camera, a depth material shades by distance, and a checker texture shows how the UVs stretch a picture over the shape.
>
> **Used for:** Spotting a flipped normal before it gets blamed on the lights; finding where a texture stretches or breaks at a seam; checking how a model's triangles are spread; and seeing whether a camera's near and far planes suit the scene.

## A · The basics

### One shape, four pictures

A lit, textured surface mixes many things into one color: the light, the normals, the texture, the UVs. When it looks wrong, you can't tell which from the final picture. A **debug view** draws just one of them:

| View | Code | Shows | Wrong looks like |
| --- | --- | --- | --- |
| Wireframe | `material.wireframe = true` | Every triangle's edges | Long thin slivers, or triangles far too dense or sparse |
| Normals | `new MeshNormalMaterial()` | Which way each point faces, as a color | A patch in the wrong color, or a hard edge blurred into a gradient |
| Depth | `new MeshDepthMaterial()` | Distance from the camera: white near, black far | All black or all white: near and far don't suit the scene |
| UV checker | `material.map = checker` | How the texture is laid over the surface | Stretched squares, or a jump in the pattern at a seam |

**Analogy: a doctor's scans.** An X-ray shows the bones and an ultrasound the soft tissue: one body, and each picture answers one question. Nobody diagnoses a broken bone from a photo.

### Bad normals show as color, not just as lighting

A normal problem under the lights looks like a shading problem: a dark patch that could pass for a shadow. `MeshNormalMaterial` ignores lights and turns each normal into a color: X into red, Y into green, Z into blue. Those directions are measured from the camera, so a surface facing you is blue-violet, whatever way it faces in the world, and the colors change as you orbit. A normal pointing the wrong way shows in the wrong color, however it's lit.

The tank has a patch of flipped normals. Compare the lit view with the normal view, orbit the camera, then try the others.

<div data-scene="views"></div>

## B · Working knowledge

### Switching a view on and off

```js
scene.overrideMaterial = new MeshNormalMaterial(); // every mesh at once
scene.overrideMaterial = null;                     // and back
```

The material override and restore page covers `overrideMaterial` and swapping one mesh's material. `wireframe` is a setting on the material, so every mesh that shares the material shows it.

### Normal problems

- **Flipped normals** show as a patch in the colors of a surface facing away.
- **A hard edge smoothed over** shows as a gradient across a corner that should change color sharply (the vertex normals page).
- **Lines instead of colors:** the helpers page's `VertexNormalsHelper` draws each normal.

For normals as colors in the world rather than from the camera, the shaders domain's debug output page writes a small shader.

### UV stretching

A checker made in code, with no image file:

```js
const canvas = document.createElement('canvas');
canvas.width = canvas.height = 256;
const context = canvas.getContext('2d');
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    context.fillStyle = (x + y) % 2 ? '#ffffff' : '#f97316';
    context.fillRect(x * 32, y * 32, 32, 32);
  }
}
const checker = new CanvasTexture(canvas);
checker.colorSpace = SRGBColorSpace;
```

The squares should come out square and the same size everywhere. Wide or tall rectangles mean the UVs stretch the texture there; a jump in the pattern is a seam (the UVs page).

### Depth issues

`MeshDepthMaterial` shades by the same depth the depth buffer stores, and most of that range is used up close to the camera, as the depth precision page showed. With `near` at 0.1, anything a few units away comes out nearly black. Raising `near` spreads the shades out; a view that's still all black or all white says `near` and `far` don't suit the scene.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
